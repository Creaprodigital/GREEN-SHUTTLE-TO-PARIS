export async function migrateOldDataToNewKeys() {
  try {
    const oldFleetKey = 'fleet'
    const newFleetKey = 'fleet-data'
    const oldPricingKey = 'pricing'
    const newPricingKey = 'pricing-data'
    const oldOptionsKey = 'service-options'
    const newOptionsKey = 'service-options-data'
    const oldPromoKey = 'promo-codes'
    
    const oldFleetData = await spark.kv.get(oldFleetKey)
    const newFleetData = await spark.kv.get(newFleetKey)
    
    if (oldFleetData && (!newFleetData || (Array.isArray(newFleetData) && newFleetData.length === 0))) {
      console.log('🔄 Migration: Copying fleet data from old key to new key')
      await spark.kv.set(newFleetKey, oldFleetData)
      console.log('✅ Fleet data migrated successfully')
    }
    
    const oldPricingData = await spark.kv.get(oldPricingKey)
    const newPricingData = await spark.kv.get(newPricingKey)
    
    if (oldPricingData && (!newPricingData || (Array.isArray(newPricingData) && newPricingData.length === 0))) {
      console.log('🔄 Migration: Copying pricing data from old key to new key')
      await spark.kv.set(newPricingKey, oldPricingData)
      console.log('✅ Pricing data migrated successfully')
    }
    
    const oldOptionsData = await spark.kv.get(oldOptionsKey)
    const newOptionsData = await spark.kv.get(newOptionsKey)
    
    if (oldOptionsData && (!newOptionsData || (Array.isArray(newOptionsData) && newOptionsData.length === 0))) {
      console.log('🔄 Migration: Copying options data from old key to new key')
      await spark.kv.set(newOptionsKey, oldOptionsData)
      console.log('✅ Options data migrated successfully')
    }
    
    const promoData = await spark.kv.get(oldPromoKey)
    if (promoData) {
      console.log('✅ Promo codes already exist:', promoData)
    }
    
    console.log('✅ Data migration complete')
  } catch (error) {
    console.error('❌ Error during data migration:', error)
  }
}
