/**
 * Feature flags configuration
 * @description Šis failas naudojamas funkcionalumų įjungimui/išjungimui
 */
export interface IFeatureFlags {
    enableFacebookAuth: boolean;
}

export const defaultFeatureFlags: IFeatureFlags = {
    enableFacebookAuth: false,
};

/**
 * Feature flags service
 * @description Servisas skirtas funkcionalumų valdymui
 */
class FeatureService {
    private features: IFeatureFlags;

    constructor(initialFeatures: Partial<IFeatureFlags> = {}) {
        this.features = {
            ...defaultFeatureFlags,
            ...initialFeatures
        };
    }

    /**
     * Patikrina ar funkcionalumas įjungtas
     * @param feature - funkcionalumo pavadinimas
     * @returns boolean
     */
    isEnabled(feature: keyof IFeatureFlags): boolean {
        return this.features[feature] ?? false;
    }

    /**
     * Atnaujina funkcionalumų būsenas
     * @param features - funkcionalumų objektas
     */
    updateFeatures(features: Partial<IFeatureFlags>): void {
        this.features = {
            ...this.features,
            ...features
        };
    }
}

export const featureService = new FeatureService();
