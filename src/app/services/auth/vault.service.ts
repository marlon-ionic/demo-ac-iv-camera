/* eslint-disable max-len */
import { Injectable, NgZone } from '@angular/core';
import { BrowserVault, Device, DeviceSecurityType, IdentityVaultConfig, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { Platform } from '@ionic/angular';
const config: IdentityVaultConfig = {
  key: 'io.ionic.demo.acivcamera',
  lockAfterBackgrounded: 1000,
  type: VaultType.SecureStorage,
  customPasscodeInvalidUnlockAttempts: 2,
  shouldClearVaultAfterTooManyFailedAttempts: true,
  unlockVaultOnLoad: false
};

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  vault: BrowserVault | Vault;
  constructor(private platform: Platform, private zone: NgZone) {
    Device.setHideScreenOnBackground(true);
    console.log('VaultService');
    this.vault = platform.is('capacitor') ? new Vault(config) : new BrowserVault({...config, ...{type: VaultType.InMemory}});
  }

  async init(): Promise<void> {
    const isBiometricsEnabled = await Device.isBiometricsEnabled();
    const isSystemPasscodeSet = await Device.isSystemPasscodeSet();
    const updates = {
      type: isBiometricsEnabled || isSystemPasscodeSet ? VaultType.DeviceSecurity : this.platform.is('capacitor') ? VaultType.SecureStorage : VaultType.InMemory,
      deviceSecurityType: isBiometricsEnabled && isSystemPasscodeSet ? DeviceSecurityType.Both : isBiometricsEnabled ? DeviceSecurityType.Biometrics : isSystemPasscodeSet ? DeviceSecurityType.SystemPasscode : DeviceSecurityType.None
    };
    // Update Vault configuration based on device's capabilites
    // If there are specific security requirements for the app, this would be a good place to apply a warning/enforce them
    await this.update(updates);
  }

  async update(params: any): Promise<void> {
    await this.vault.updateConfig({
      ...this.vault.config,
      ...params
    });
  }
}
