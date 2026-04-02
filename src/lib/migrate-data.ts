export async function migrateOldDataToNewKeys() {
  try {
    const newFleetKey = 'fleet-
    const newPricingKey = 'pricing-d
    const oldPricingKey = 'pricing'
    const newPricingKey = 'pricing-data'
    const oldOptionsKey = 'service-options'
    const newOptionsKey = 'service-options-data'
    const newFleetData = await spark.
    
      await spark.kv.set(newFleetKey, oldFleetData)
    }
    
    
      console.log('🔄 Migration: Copying pricing data from old key to new key
      console.log('✅ Pricing data migrated successf
    
    c
    
      await spark.kv.set(newOptionsKey, oldOptionsData)
    }
    
      console.log('✅ Promo codes already exist:', promoData)
    
  } catch (error) {
  }






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
