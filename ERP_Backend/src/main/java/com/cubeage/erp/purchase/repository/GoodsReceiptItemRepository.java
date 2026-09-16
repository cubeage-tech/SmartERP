package com.cubeage.erp.purchase.repository;

import com.cubeage.erp.purchase.entity.GoodsReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoodsReceiptItemRepository extends JpaRepository<GoodsReceiptItem, Long> {

    List<GoodsReceiptItem> findByGoodsReceiptId(Long grnId);
}