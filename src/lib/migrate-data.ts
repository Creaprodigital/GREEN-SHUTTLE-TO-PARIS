export async function migrateOldDataToNewKeys() {
    con
    const oldPricingKey = 'pric
    const oldOptionsKey = 'service-o
    const oldPricingKey = 'pricing'
    const newPricingKey = 'pricing-data'
    const oldOptionsKey = 'service-options'
    const newOptionsKey = 'service-options-data'
        console.log('✅ Fleet data mig

    const oldPricingData = await spark.kv.get(oldPricing
      const newPricingD
        console.log('🔄 Migration: Copying pricing data fr
        console.log('✅ Pri
    }
    const oldOptionsData = await spark.kv.get(oldOpti
      const newOptionsData = await spark.kv.get(newOption
       
     

    const promoData = await spark.kv.get(oldPromoKey)
      console.log('✅ Prom

  } catch (error) {
  }







      const newOptionsData = await spark.kv.get(newOptionsKey)
      if (!newOptionsData) {
        console.log('🔄 Migration: Copying options data from old key to new key')
        await spark.kv.set(newOptionsKey, oldOptionsData)
        console.log('✅ Options data migrated successfully')
      }
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
