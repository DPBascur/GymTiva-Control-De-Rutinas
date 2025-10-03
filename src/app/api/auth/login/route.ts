import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Iniciando proceso de login...');
    
    // Conectar a la base de datos con timeout
    const dbConnectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 15000)
    );
    
    try {
      await Promise.race([dbConnectPromise, timeoutPromise]);
      console.log('✅ Conexión a DB establecida');
    } catch (dbError) {
      console.error('❌ Error de conexión a DB:', dbError);
      return NextResponse.json(
        { error: 'Error de conexión al servidor. Por favor intenta nuevamente.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    console.log('📧 Intentando login para:', email);

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    console.log('🔍 Buscando usuario en DB...');
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log('👤 Login: Usuario no encontrado para email:', email);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('👤 Login: Usuario encontrado:', {
      id: user._id,
      email: user.email,
      isActive: user.isActive
    });

    // Migración automática: Si isActive es undefined, establecerlo como true
    if (user.isActive === undefined) {
      console.log('🔄 Migrando usuario: estableciendo isActive=true para', email);
      await User.findByIdAndUpdate(user._id, { isActive: true });
      user.isActive = true;
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('👤 Login: Contraseña inválida para:', email);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar si el usuario está activo (ahora manejando undefined correctamente)
    if (user.isActive === false) {
      console.log('👤 Login: Usuario desactivado:', email, 'isActive:', user.isActive);
      return NextResponse.json(
        { error: 'Cuenta desactivada. Contacta al soporte' },
        { status: 403 }
      );
    }

    console.log('👤 Login: Login exitoso para:', email);

    // Crear JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Actualizar último login
    await User.findByIdAndUpdate(user._id, { 
      updatedAt: new Date() 
    });

    // Responder con usuario completo (sin contraseña) y token
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      preferences: user.preferences,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // Crear respuesta con cookie
    const response = NextResponse.json(
      { 
        message: 'Login exitoso',
        user: userResponse,
        token 
      },
      { status: 200 }
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

  } catch (error) {
    console.error('❌ Error en login:', error);
    
    // Verificar si es un error de timeout de MongoDB
    if (error instanceof Error) {
      if (error.message.includes('buffering timed out') || 
          error.message.includes('Database connection timeout')) {
        return NextResponse.json(
          { error: 'No se pudo conectar a la base de datos. Por favor verifica tu conexión a internet e intenta nuevamente.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
        return NextResponse.json(
          { error: 'Error de red. Verifica tu conexión a internet.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor intenta nuevamente.' },
      { status: 500 }
    );
  }
}