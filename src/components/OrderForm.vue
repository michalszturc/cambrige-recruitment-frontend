<template>
  <div>
    <h1>Make your order</h1>
  </div>
  <div class="main-container">
    <el-form ref="order-form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="Select product:">
        <el-select
          v-model="form.productId"
          placeholder="Select"
          @change="handleChange"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Email:">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="Select quantity:">
        <el-input-number
          v-model="form.quantity"
          :max="maxQuantity"
          :min="minQuantity"
        />
      </el-form-item>
      <el-form-item label="Promotion code:" class="promotion">
        <el-input v-model="form.promoCode"></el-input>
        <el-button type="success" class="applay-button" @click="applayPromo">
          Applay
        </el-button>
      </el-form-item>
      <el-form-item label="Summary Price:">
        <span> {{ summaryPrice - discountPrice }}$ </span>
      </el-form-item>
      <el-form-item label="Applied discount:" v-if="discount">
        <span class="discount"> {{ discountPrice }}$ </span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitDraft">Create</el-button>
      </el-form-item>
      <el-dialog
        v-model="dialogVisible"
        title="Confirm Order"
        width="60%"
        :before-close="handleClose"
      >
        <div>
          <el-descriptions
            title="Order Summary"
            :column="1"
            :size="size"
            border
          >
            <el-descriptions-item label="Product:">{{
              draftProductName
            }}</el-descriptions-item>
            <el-descriptions-item label="Address email:">{{
              orderDraft.email
            }}</el-descriptions-item>
            <el-descriptions-item label="Final price:"
              >{{ orderDraft.orderPrice.toFixed(2) }}$</el-descriptions-item
            >
          </el-descriptions>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="makeOrder">Confirm</el-button>
          </span>
        </template>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import { getProducts } from "@/api/products.js";
import { getPromo } from "@/api/promotions.js";
import { createDraft, createOrder } from "@/api/orders.js";

export default {
  name: "OrderForm",
  data() {
    return {
      productList: null,
      discount: null,
      orderDraft: null,
      dialogVisible: false,
      form: {
        productId: null,
        email: null,
        quantity: 0,
        promoCode: null,
      },
      rules: {
        productId: [{ required: true }],
        email: [
          {
            required: true,
            type: "email",
            message: "Incorrect email address",
            trigger: "blur",
          },
        ],
      },
    };
  },
  async created() {
    await this.getAllProducts();
  },
  computed: {
    selectedProduct() {
      return this.getProduct(this.form.productId);
    },
    summaryPrice() {
      if (this.selectedProduct === null) {
        return 0;
      }
      return this.selectedProduct.unitPrice * this.form.quantity;
    },
    minQuantity() {
      if (this.selectedProduct === null) {
        return 0;
      }
      return this.selectedProduct.minQuantity;
    },
    maxQuantity() {
      if (this.selectedProduct === null) {
        return 10;
      }
      return this.selectedProduct.maxQuantity;
    },
    discountPrice() {
      if (this.discount !== null) {
        return (this.summaryPrice * this.discount).toFixed(2);
      }
      return 0;
    },
    draftProductName() {
      return this.getProduct(this.orderDraft?.productId)?.name;
    },
  },

  methods: {
    async getAllProducts() {
      getProducts().then((respone) => {
        this.productList = respone.data;
      });
    },
    getProduct(id) {
      if (this.form.productId === null) {
        return null;
      }
      const product = this.productList?.find((product) => product.id === id);
      return product;
    },
    handleChange() {
      if (this.form.quantity < this.selectedProduct.minQuantity) {
        this.form.quantity = this.selectedProduct.minQuantity;
      }
    },
    applayPromo() {
      getPromo(this.form.promoCode).then((respone) => {
        console.log(respone);
        if (respone.ok) {
          this.discount = respone.data.discountPercent;
          this.$message({
            message: "Promotion code is applied",
            type: "success",
            center: true,
          });
        } else {
          this.$message({
            message: "Promotion code is invalid",
            type: "error",
            center: true,
          });
          this.form.promoCode = null;
          this.discount = null;
        }
      });
    },
    onSubmitDraft() {
      this.$refs["order-form"].validate((valid) => {
        if (valid) {
          if (this.discount == null) {
            this.form.promoCode = null;
          }
          createDraft(this.form).then((respone) => {
            if (respone.ok) {
              this.orderDraft = respone.data;
              this.dialogVisible = true;
            } else {
              this.$message({
                message: "From is invlaid",
                type: "error",
                center: true,
              });
            }
          });
        } else {
          this.$message({
            message: "From is invlaid",
            type: "error",
            center: true,
          });
          return false;
        }
      });
    },

    makeOrder() {
      createOrder(this.form).then((respone) => {
        if (respone.ok) {
          this.$message({
            message:
              "Order was sucesffuly created. Order number: " +
              respone.data.orderNumber,
            type: "success",
            center: true,
          });
          this.dialogVisible = false;
        } else {
          this.$message({
            message: "From is invlaid",
            type: "error",
            center: true,
          });
        }
      });
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
.main-container {
  display: inline-block;
  width: 50%;
}
.promotion {
  margin: 5px;
}
.applay-button {
  width: 250px;
  font-weight: bold;
  margin: 15px;
}
.discount {
  color: rgb(153, 15, 15);
}
</style>
