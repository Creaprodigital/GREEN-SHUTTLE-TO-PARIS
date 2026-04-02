export async function migrateOldDataToNewKeys() {
  try {
    const oldPricingKey = 'pricing'
    const newPricingKey = 'pricing-data'
    if (oldPricingData) {
      if (!newPricingData) {

      }
    if (oldPricingData) {
      const newPricingData = await spark.kv.get(newPricingKey)
      if (!newPricingData) {
        console.log('🔄 Migration: Copying pricing data from old key to new key')
        await spark.kv.set(newPricingKey, oldPricingData)
        console.log('✅ Pricing data migrated successfully')
      }
    }

    const oldOptionsData = await spark.kv.get(oldOptionsKey)
    console.log('✅ Data m
      const newOptionsData = await spark.kv.get(newOptionsKey)
  }
        console.log('🔄 Migration: Copying options data from old key to new key')

        console.log('✅ Options data migrated successfully')

    }

    console.log('✅ Data migration complete')
  } catch (error) {
    console.error('❌ Error during data migration:', error)

}
