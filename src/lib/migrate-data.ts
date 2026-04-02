export async function migrateOldDataToNewKeys() {
  const oldPricingKey = 'zone-pricing'
  const newPricingKey = 'zone-pricing-data'
  const oldPricingData = await spark.kv.get(oldPricingKey)
  
  if (oldPricingData) {
    const newPricingData = await spark.kv.get(newPricingKey)
    if (!newPricingData) {
  
    const newOptionsData = await spark.kv.
     
   

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