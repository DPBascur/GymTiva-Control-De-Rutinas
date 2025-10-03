import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

export async function PATCH(request: Request) {
  try {
    await connectDB();

    // Obtener token del usuario
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Obtener datos del body
    const { age, weight, height } = await request.json();

    // Calcular IMC
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Actualizar usuario
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $set: {
          'profile.age': age,
          'profile.weight': weight,
          'profile.height': height,
          'profile.bmi': parseFloat(bmi.toFixed(1))
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('❌ Error actualizando perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    // Obtener token del usuario
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Obtener usuario
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile || {
          age: 0,
          weight: 0,
          height: 0,
          bmi: 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
