export async function migrateOldDataToNewKeys() {
  const newPricingKey = 'zone-pricing-d
  const newPricingKey = 'zone-pricing-data';
  const oldPricingData = await spark.kv.get(oldPricingKey);
  
    }

  const newOptionsKey = 'v
  
    const newOptionsData = await spark.kv.g
     
   








      await spark.kv.set(newOptionsKey, oldOptionsData);
      await spark.kv.delete(oldOptionsKey);
    }
  }
}