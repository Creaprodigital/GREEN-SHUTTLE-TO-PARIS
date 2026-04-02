export async function migrateOldDataToNewKeys() {
    con
    const oldPricingKey = 'pricing'
    const newPricingKey = 'pricing-data'
    const oldPricingData = await spark.kv.get(oldPricingKey)
    
        console.log('🔄 M
      const newPricingData = await spark.kv.get(newPricingKey)
      }
        console.log('🔄 Migration: Copying pricing data from old key to new key')
        await spark.kv.set(newPricingKey, oldPricingData)
        console.log('✅ Pricing data migrated successfully')
    
    }

    const oldOptionsKey = 'booking-options'
}















