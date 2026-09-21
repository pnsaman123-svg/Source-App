export interface EnergyTelemetry {
  userName: string;
  solarGenerationKw: number;
  gridPowerKw: number;
  batterySocPercent: number;
  loadConsumptionKw: number;
  sourceMonitoringKwh: number;
  weeklyEarningsInr: number;
  co2SavingsTons: number;
  batteryStatus: 'Good' | 'Optimal' | 'Degraded';
  sourceStatus: 'Optimal' | 'Good' | 'Low';
  loadStatus: 'Moderate' | 'Heavy' | 'Light';
}

export type TabType = 'home' | 'savings' | 'service' | 'profile';
