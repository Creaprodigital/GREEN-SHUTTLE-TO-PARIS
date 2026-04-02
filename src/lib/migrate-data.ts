export async function migrateOldDataToNewKeys() {
  const oldPricingKey = 'pricing'
  const newPricingKey = 'pricing-data'
  const oldPricingData = await spark.kv.get(oldPricingKey)
  
  if (oldPricingData) {
    const newPricingData = await spark.kv.get(newPricingKey)
    if (!newPricingData) {
  const oldOptionsData = await spark.kv.get(oldOptionsKey)
  if (oldOptionsData) {
    if (!newOptionsData) {
     
   














