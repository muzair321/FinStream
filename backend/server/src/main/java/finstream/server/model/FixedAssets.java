package finstream.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Entity
@Table(name = "fixed_assets")

public class FixedAssets {
    @Id
    @Column(name = "asset_id")
    private String invoiceId;

    @Column(name = "asset_name", nullable = false)
    private String assetName;

    @Column(name = "purchase_cost_pkr", nullable = false)
    private BigDecimal purchaseCostPkr;

    @Column(name = "depreciation_rate_annual", nullable = false)
    private Double depreciationRateAnnual;
}
