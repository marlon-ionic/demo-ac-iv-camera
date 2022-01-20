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
    this.vault = platform.is('capacitor') ? new Vault(config) : new BrowserVault(config);
  }

  async init(): Promise<void> {
    const isBiometricsEnabled = await Device.isBiometricsEnabled();
    const isSystemPasscodeSet = await Device.isSystemPasscodeSet();
    const updates = {
      type: isBiometricsEnabled || isSystemPasscodeSet ? VaultType.DeviceSecurity : VaultType.SecureStorage,
      // eslint-disable-next-line max-len
      deviceSecurityType: isBiometricsEnabled && isSystemPasscodeSet ? DeviceSecurityType.Both : isBiometricsEnabled ? DeviceSecurityType.Biometrics : isSystemPasscodeSet ? DeviceSecurityType.SystemPasscode : DeviceSecurityType.None
    };
    await this.update(updates);
  }

  async update(params: any): Promise<void> {
    await this.vault.updateConfig({
      ...this.vault.config,
      ...params
    });
  }
}
