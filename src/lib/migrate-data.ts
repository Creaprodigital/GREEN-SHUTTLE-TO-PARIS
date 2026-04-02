export async function migrateOldDataToNewKeys() {
  const oldPricingKey = 'pricing'
  
    const newPricingData = await spark.kv.get(newPricingKe
  
  if (oldPricingData) {
    const newPricingData = await spark.kv.get(newPricingKey)
    if (!newPricingData) {
      await spark.kv.set(newPricingKey, oldPricingData)
      await spark.kv.delete(oldPricingKey)
  con
  }

  const oldOptionsKey = 'vehicle-options'
  const newOptionsKey = 'vehicle-options-data'
  const oldOptionsData = await spark.kv.get(oldOptionsKey)
}












