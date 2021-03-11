<template>
  <div class="menuTree">
    <label v-for="item in data" :key="item.path">
      <el-submenu
        v-if="item.children && item.children.length > 0"
        :index="item.title"
      >
        <template slot="title">
          <svg-icon
            v-if="item.icon"
            :svg-name="getPath(item.icon)"
            class-name="menu-icon"
          />
          <span class="menu-text">{{ item.title }}</span>
        </template>
        <menutree :data="item.children" :active="active" />
      </el-submenu>
      <el-menu-item
        v-else
        :index="item.path + ',' + item.permissionId"
        :disabled="item.path ? false : true"
      >
        <span slot="title">
          <svg-icon
            v-if="item.icon"
            :svg-name="getPath(item.icon)"
            class-name="menu-icon"
          />
          <span class="menu-text">{{ item.title }}</span>
          <span
            v-if="item.path + ',' + item.permissionId === active"
            class="menu-bg"
          />
        </span>
      </el-menu-item>
    </label>
  </div>
</template>

<script>
export default {
  name: "Menutree",
  props: {
    data: {
      type: Array,
      required: true,
    },
    active: {
      type: String,
      default: "",
    },
  },
  methods: {
    getPath(path) {
      if (typeof path === "undefined") {
        return;
      }
      const index = path.indexOf(".");
      return path.substring(0, index);
    },
  },
};
</script>

<style lang="scss" scoped>
.menuTree {
  /deep/.el-menu-item {
    position: relative;

    &:hover {
      background-color: rgb(243, 246, 249) !important;
    }

    .menu-bg {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      background-color: #5da1ff;
      opacity: 0.1;
      left: 0;
      top: 0;
    }
  }
  .is-active > .el-submenu__title {
    color: #2b77ff;
  }
  .menu-icon {
    width: 16px;
    height: 16px;
  }
  .menu-text {
    margin-left: 8px;
  }
}
</style>