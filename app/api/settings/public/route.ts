import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SYSTEM_SETTING_DEFAULTS } from '@/lib/system-settings';

export const dynamic = "force-dynamic";

// GET: Obtener configuración pública (para signup)
export async function GET(request: NextRequest) {
  try {
    const settingKeys = ['defaultUserActive', 'signupEnabled', 'passwordMinLength', 'allowExternalPdfExport'];
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: settingKeys,
        },
      },
    });
    const settingsMap: Record<string, string> = { ...SYSTEM_SETTING_DEFAULTS };
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json({ 
      defaultUserActive: settingsMap.defaultUserActive === 'true',
      signupEnabled: settingsMap.signupEnabled !== 'false',
      passwordMinLength: parseInt(settingsMap.passwordMinLength || '8', 10),
      allowExternalPdfExport: settingsMap.allowExternalPdfExport !== 'false',
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json({
      defaultUserActive: true,
      signupEnabled: true,
      passwordMinLength: 8,
      allowExternalPdfExport: true,
    });
  }
}
