<template>
  <picker
    class="picker-type"
    @change="bindPickerChange"
    @columnchange="columnchange"
    :range="array"
    range-key="name"
    :value="value"
    mode="multiSelector"
  >
    <view class="flex row-between">
      <slot></slot>
      <u-icon size="20" name="map-fill"></u-icon>
    </view>
  </picker>
</template>

<script>
import AllAddress from './data.js'
const selectVal = ['', '', '']

export default {
  data() {
    return {
      value: [0, 0, 0],
      array: [],
      index: 0
    }
  },
  created() {
    this.initSelect()
  },
  methods: {
    initSelect() {
      this.updateSourceDate().updateAddressDate().$forceUpdate()
    },
    // 地址控件改变控件
    columnchange(d) {
      this.updateSelectIndex(d.detail.column, d.detail.value).updateSourceDate().updateAddressDate().$forceUpdate()
    },

    updateSourceDate() {
      this.array = []
      this.array[0] = AllAddress.map((obj) => {
        return {
          name: obj.name
        }
      })
      this.array[1] = AllAddress[this.value[0]].city.map((obj) => {
        return {
          name: obj.name
        }
      })
      this.array[2] = AllAddress[this.value[0]].city[this.value[1]].area.map((obj) => {
        return {
          name: obj
        }
      })
      return this
    },

    updateSelectIndex(column, value) {
      const arr = JSON.parse(JSON.stringify(this.value))
      arr[column] = value
      if (column === 0) {
        arr[1] = 0
        arr[2] = 0
      }
      if (column === 1) {
        arr[2] = 0
      }
      this.value = arr
      return this
    },

    updateAddressDate() {
      selectVal[0] = this.array[0][this.value[0]].name
      selectVal[1] = this.array[1][this.value[1]].name
      selectVal[2] = this.array[2][this.value[2]].name
      return this
    },

    bindPickerChange(e) {
      this.$emit('change', {
        index: this.value,
        data: selectVal
      })
      return this
    }
  }
}
</script>

<style lang="scss" scoped></style>
