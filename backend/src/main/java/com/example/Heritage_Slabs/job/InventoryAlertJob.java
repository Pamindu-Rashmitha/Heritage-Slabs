package com.example.Heritage_Slabs.job;

import com.example.Heritage_Slabs.model.Product;
import com.example.Heritage_Slabs.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InventoryAlertJob {

    private static final Logger logger = LoggerFactory.getLogger(InventoryAlertJob.class);
    private final ProductRepository productRepository;

    public InventoryAlertJob(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * The @Scheduled annotation dictates when this runs.
     * fixedRate = 60000 runs it every 60 seconds (Great for testing!)
     * * FOR PRODUCTION, you should change this to a Cron expression like:
     * @Scheduled(cron = "0 0 8 * * ?") // Runs every day at 8:00 AM
     */
    @Scheduled(fixedRate = 60000)
    public void checkLowStockAndNotify() {
        logger.info("--- [SYSTEM JOB] Waking up to check inventory levels ---");

        // 1. Fetch all products that are low on stock
        List<Product> lowStockProducts = productRepository.findProductsWithLowStock();

        // 2. If everything is fine, go back to sleep
        if (lowStockProducts.isEmpty()) {
            logger.info("Inventory looks good! No items are low on stock.");
            return;
        }

        // 3. If stock is low, take action!
        logger.warn("⚠️ ALERT: Found {} items running low on stock!", lowStockProducts.size());

        for (Product product : lowStockProducts) {
            logger.warn("-> IMMEDIATE REORDER REQUIRED: {} (ID: {}) | Current Stock: {} | Threshold: {}",
                    product.getName(),
                    product.getId(),
                    product.getStockQuantity(),
                    product.getLowStockThreshold());

            // FUTURE AI/ML EXPANSION POINT:
            // Here you could automatically generate a PurchaseOrderRequestDTO
            // and pass it to your SupplierService to automatically email the supplier!
        }

        logger.info("--- [SYSTEM JOB] Inventory check complete ---");
    }
}