export async function migrateOldDataToNewKeys() {
  const oldPricingKey = 'pricing'
  const newPricingKey = 'pricing-data'
  const oldPricingData = await spark.kv.get(oldPricingKey)
  
  if (oldPricingData) {
    const newPricingData = await spark.kv.get(newPricingKey)
    if (!newPricingData) {
      await spark.kv.set(newPricingKey, oldPricingData)
      await spark.kv.delete(oldPricingKey)
    }
  }

  const oldOptionsKey = 'vehicle-options'
  const newOptionsKey = 'vehicle-options-data'
  const oldOptionsData = await spark.kv.get(oldOptionsKey)
  
  if (oldOptionsData) {
    const newOptionsData = await spark.kv.get(newOptionsKey)
    if (!newOptionsData) {
      await spark.kv.set(newOptionsKey, oldOptionsData)
      await spark.kv.delete(oldOptionsKey)
    }
  }
}





