import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST() {
  try {
    console.log('🔄 Iniciando migración de usuarios...');
    
    // Conectar a la base de datos
    await connectDB();

    // Encontrar usuarios que no tienen el campo isActive definido
    const usersWithoutIsActive = await User.find({
      $or: [
        { isActive: { $exists: false } },
        { isActive: undefined }
      ]
    });

    console.log(`📊 Usuarios encontrados para migrar: ${usersWithoutIsActive.length}`);

    if (usersWithoutIsActive.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay usuarios para migrar',
        migratedCount: 0
      });
    }

    // Actualizar todos los usuarios para que tengan isActive: true
    const result = await User.updateMany(
      {
        $or: [
          { isActive: { $exists: false } },
          { isActive: undefined }
        ]
      },
      {
        $set: { isActive: true }
      }
    );

    console.log(`✅ Migración completada: ${result.modifiedCount} usuarios actualizados`);

    return NextResponse.json({
      success: true,
      message: `Migración completada exitosamente`,
      migratedCount: result.modifiedCount,
      totalFound: usersWithoutIsActive.length
    });

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    return NextResponse.json(
      { 
        error: 'Error interno durante la migración',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Endpoint GET para verificar cuántos usuarios necesitan migración
export async function GET() {
  try {
    await connectDB();

    const usersWithoutIsActive = await User.countDocuments({
      $or: [
        { isActive: { $exists: false } },
        { isActive: undefined }
      ]
    });

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    return NextResponse.json({
      success: true,
      statistics: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        usersNeedingMigration: usersWithoutIsActive
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return NextResponse.json(
      { error: 'Error obteniendo estadísticas de usuarios' },
      { status: 500 }
    );
  }
}