import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    console.log('🔗 Iniciando registro, conectando a DB...');
    await connectDB();
    console.log('✅ Conexión a DB exitosa');

    const body = await request.json();
    console.log('📝 Datos recibidos para registro:', { 
      name: body.name, 
      email: body.email,
      age: body.age,
      weight: body.weight,
      height: body.height
    });
    const { name, email, password, age, weight, height } = body;

    // Validaciones básicas
    if (!name || !email || !password || !age || !weight || !height) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Validar edad, peso y altura
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseInt(height);

    if (ageNum < 13 || ageNum > 100) {
      return NextResponse.json(
        { error: 'La edad debe estar entre 13 y 100 años' },
        { status: 400 }
      );
    }

    if (weightNum < 30 || weightNum > 300) {
      return NextResponse.json(
        { error: 'El peso debe estar entre 30 y 300 kg' },
        { status: 400 }
      );
    }

    if (heightNum < 120 || heightNum > 250) {
      return NextResponse.json(
        { error: 'La altura debe estar entre 120 y 250 cm' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe con retry
    console.log('🔍 Verificando si el usuario existe...');
    let existingUser = null;
    
    try {
      // Primer intento con timeout extendido
      console.log('🔍 Buscando usuario con timeout de 45 segundos...');
      existingUser = await User.findOne({ email: email.toLowerCase() })
        .maxTimeMS(45000)
        .lean()
        .exec();
      console.log('✅ Búsqueda de usuario completada');
    } catch (findError) {
      console.log('⚠️ Primer intento falló, esperando y reintentando...', findError instanceof Error ? findError.message : 'Error desconocido');
      
      // Esperar un momento antes del reintento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Segundo intento con timeout aún mayor
      try {
        console.log('🔍 Segundo intento con timeout de 60 segundos...');
        existingUser = await User.findOne({ email: email.toLowerCase() })
          .maxTimeMS(60000)
          .lean();
        console.log('✅ Segunda búsqueda de usuario completada');
      } catch (secondError) {
        console.error('❌ Error al verificar usuario existente después de 2 intentos:', secondError);
        throw new Error('Error al verificar usuario existente en la base de datos después de múltiples intentos');
      }
    }
    
    if (existingUser) {
      console.log('⚠️ Usuario ya existe:', email);
      return NextResponse.json(
        { error: 'El usuario ya existe con ese email' },
        { status: 400 }
      );
    }
    
    console.log('✅ Email disponible, continuando con registro...');

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      profile: {
        age: ageNum,
        weight: weightNum,
        height: heightNum,
        bmi: Number((weightNum / Math.pow(heightNum / 100, 2)).toFixed(1)), // Calcular IMC
      },
      isActive: true, // Asegurar que el usuario esté activo desde el inicio
      preferences: {
        units: 'metric',
        goals: []
      }
    });

    console.log('💾 Guardando nuevo usuario en la base de datos...');
    await newUser.save({ 
      maxTimeMS: 60000, // 60 segundos timeout
      wtimeout: 60000   // Write timeout extendido
    });

    console.log('👤 Register: Usuario creado exitosamente:', {
      id: newUser._id,
      email: newUser.email,
      isActive: newUser.isActive
    });

    // Crear JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email,
        name: newUser.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Responder con usuario completo (sin contraseña) y token
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profile: newUser.profile,
      preferences: newUser.preferences,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    // Crear respuesta con cookie
    const response = NextResponse.json(
      { 
        message: 'Usuario registrado e iniciado sesión exitosamente',
        user: userResponse,
        token 
      },
      { status: 201 }
    );

    // Establecer cookie con el token
    response.cookies.set('auth-token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800, // 7 días
      path: '/'
    });

    return response;

  } catch (error: unknown) {
    console.error('❌ Error en registro:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    // Manejo específico de errores de MongoDB
    if (errorMessage.includes('buffering timed out')) {
      return NextResponse.json(
        { error: 'Timeout de conexión a la base de datos. Por favor, inténtalo de nuevo.' },
        { status: 408 }
      );
    }
    
    if (errorMessage.includes('ServerSelectionError') || errorMessage.includes('connection')) {
      return NextResponse.json(
        { error: 'Error de conexión con la base de datos. Por favor, verifica tu conexión.' },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes('duplicate') || errorMessage.includes('E11000')) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor, inténtalo de nuevo.' },
      { status: 500 }
    );
  }
}