export async function migrateOldDataToNewKeys() {
  const newPricingKey = 'zone-pri
  const newPricingKey = 'zone-pricing-data'
  const oldPricingData = await spark.kv.get(oldPricingKey)
  
    }

  const newOptionsKey = 'v
  
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

