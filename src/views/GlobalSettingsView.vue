<template>
  <div class="global-settings">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">全局设置</h1>
      </div>
    </div>

    <div class="settings-layout">
      <!-- 左侧 Tab 导航 -->
      <div class="settings-sidebar">
        <!-- 全局配置分组 -->
        <div class="nav-group">
          <div class="nav-group-title">
            <svg
              class="nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            全局配置
          </div>
          <div class="nav-items">
            <div
              class="nav-item"
              :class="{ active: activeTab === 'color-config' }"
              @click="activeTab = 'color-config'"
            >
              <span class="nav-dot"></span>
              颜色配置
            </div>
            <div
              class="nav-item"
              :class="{ active: activeTab === 'personal-info' }"
              @click="activeTab = 'personal-info'"
            >
              <span class="nav-dot"></span>
              个人信息配置
            </div>
          </div>
        </div>

        <!-- 页面配置分组 -->
        <div class="nav-group">
          <div class="nav-group-title">
            <svg
              class="nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            页面配置
          </div>
          <div class="nav-items">
            <div
              v-for="config in pageConfigs"
              :key="config.id"
              class="nav-item"
              :class="{ active: activeTab === 'page-' + config.id }"
              @click="selectPageConfig(config.id)"
            >
              <span class="nav-dot"></span>
              {{ config.name }}配置
            </div>
          </div>
        </div>

        <!-- 返回按钮 -->
        <div class="sidebar-footer">
          <a-button @click="goBack" class="back-button">
            <svg
              class="back-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            返回个人页面
          </a-button>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="settings-content">
        <!-- 全局配置 - 颜色配置 -->
        <div v-show="activeTab === 'color-config'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">颜色配置</h2>
            <p class="section-desc">自定义网站的主题色、导航栏和背景颜色</p>
          </div>

          <div class="config-list-full">
            <!-- 主题颜色 -->
            <div class="config-card-full">
              <div class="card-header">
                <h3 class="card-title">主题颜色</h3>
                <a-button @click="resetToDefault" class="reset-button">
                  <svg
                    class="reset-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3 3v5h5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  恢复默认
                </a-button>
              </div>
              <div class="card-body">
                <p class="card-desc">修改网站主色调配置</p>
                <div class="theme-color-editor">
                  <div class="color-input-wrapper">
                    <label class="input-label">色值（16 进制）</label>
                    <a-input
                      v-model:value="localHexColor"
                      @blur="handleHexColorBlur"
                      placeholder="40E0D0"
                      class="hex-input"
                    >
                      <template #prefix>
                        <span class="hash-symbol">#</span>
                      </template>
                    </a-input>
                  </div>
                  <div class="color-picker-wrapper">
                    <div
                      class="color-palette cursor-pointer"
                      :style="{ backgroundColor: localPrimaryColor }"
                      @click="triggerColorPicker"
                    >
                      <span class="palette-text" :style="{ color: primaryColor }">{{
                        localPrimaryColor
                      }}</span>
                    </div>
                    <input
                      ref="colorInputRef"
                      type="color"
                      v-model="localPrimaryColor"
                      @change="handleColorChange"
                      class="color-picker-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 配色灵感推荐 -->
            <div class="config-card-full">
              <div class="card-header">
                <h3 class="card-title">配色灵感推荐</h3>
              </div>
              <div class="card-body">
                <p class="card-desc">精选实用配色方案，一键应用</p>
                <div class="color-scheme-grid">
                  <!-- 方案 1: 简约黑色 -->
                  <div
                    class="color-scheme-card"
                    @click="applyColorScheme('#000000', '#FFFFFF', '#F5F5F0')"
                  >
                    <div class="scheme-preview">
                      <div class="scheme-color" style="background-color: #f5f5f0"></div>
                      <div class="scheme-color" style="background-color: #ffffff"></div>
                      <div class="scheme-color" style="background-color: #000000"></div>
                    </div>
                    <div class="scheme-info">
                      <span class="scheme-name">简约黑色</span>
                      <span class="scheme-colors">#F5F5F0 · #FFFFFF · #000000</span>
                    </div>
                  </div>

                  <!-- 方案 2: 暖调活力 -->
                  <div
                    class="color-scheme-card"
                    @click="applyColorScheme('#B22A2A', '#F6C12C', '#F0DEBF')"
                  >
                    <div class="scheme-preview">
                      <div class="scheme-color" style="background-color: #f0debf"></div>
                      <div class="scheme-color" style="background-color: #f6c12c"></div>
                      <div class="scheme-color" style="background-color: #b22a2a"></div>
                    </div>
                    <div class="scheme-info">
                      <span class="scheme-name">暖调活力</span>
                      <span class="scheme-colors">#F0DEBF · #F6C12C · #B22A2A</span>
                    </div>
                  </div>

                  <!-- 方案 3: 静谧森林 -->
                  <div
                    class="color-scheme-card"
                    @click="applyColorScheme('#506850', '#99C39E', '#D3F2DE')"
                  >
                    <div class="scheme-preview">
                      <div class="scheme-color" style="background-color: #d3f2de"></div>
                      <div class="scheme-color" style="background-color: #99c39e"></div>
                      <div class="scheme-color" style="background-color: #506850"></div>
                    </div>
                    <div class="scheme-info">
                      <span class="scheme-name">静谧森林</span>
                      <span class="scheme-colors">#D3F2DE · #99C39E · #506850</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 导航栏颜色 -->
            <div class="config-card-full">
              <div class="card-header">
                <h3 class="card-title">导航栏颜色</h3>
                <a-button @click="resetNavbarToDefault" class="reset-button">
                  <svg
                    class="reset-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3 3v5h5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  恢复默认
                </a-button>
              </div>
              <div class="card-body">
                <p class="card-desc">自定义导航栏背景颜色</p>
                <div class="theme-color-editor">
                  <div class="color-input-wrapper">
                    <label class="input-label">色值（16 进制）</label>
                    <a-input
                      v-model:value="localNavbarHexColor"
                      @blur="handleNavbarHexColorBlur"
                      placeholder="FFFFFF"
                      class="hex-input"
                    >
                      <template #prefix>
                        <span class="hash-symbol">#</span>
                      </template>
                    </a-input>
                  </div>
                  <div class="color-picker-wrapper">
                    <div
                      class="color-palette cursor-pointer"
                      :style="{ backgroundColor: localNavbarColor }"
                      @click="triggerNavbarColorPicker"
                    >
                      <span class="palette-text" :style="{ color: primaryColor }">{{
                        localNavbarColor
                      }}</span>
                    </div>
                    <input
                      ref="navbarColorInputRef"
                      type="color"
                      v-model="localNavbarColor"
                      @change="handleNavbarColorChange"
                      class="color-picker-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 主题背景 -->
            <div class="config-card-full">
              <div class="card-header">
                <h3 class="card-title">主题背景</h3>
                <a-button @click="resetBackgroundToDefault" class="reset-button">
                  <svg
                    class="reset-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3 3v5h5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  恢复默认
                </a-button>
              </div>
              <div class="card-body">
                <p class="card-desc">设置页面背景颜色或图片</p>
                <div class="background-config">
                  <div class="background-type-selector">
                    <label class="type-label">背景类型：</label>
                    <a-radio-group
                      v-model:value="localBackgroundType"
                      @change="handleBackgroundTypeChange"
                      button-style="solid"
                      class="theme-radio-group"
                    >
                      <a-radio-button value="color">纯色背景</a-radio-button>
                      <a-radio-button value="image">图片背景</a-radio-button>
                    </a-radio-group>
                  </div>
                  <div v-show="localBackgroundType === 'color'" class="background-color-config">
                    <div class="theme-color-editor">
                      <div class="color-input-wrapper">
                        <label class="input-label">背景颜色</label>
                        <a-input
                          v-model:value="localBgHexColor"
                          @blur="handleBgHexColorBlur"
                          placeholder="F5F5F0"
                          class="hex-input"
                        >
                          <template #prefix>
                            <span class="hash-symbol">#</span>
                          </template>
                        </a-input>
                      </div>
                      <div class="color-picker-wrapper">
                        <div
                          class="color-palette cursor-pointer"
                          :style="{ backgroundColor: localBgColor }"
                          @click="triggerBgColorPicker"
                        >
                          <span class="palette-text" :style="{ color: primaryColor }">{{
                            localBgColor
                          }}</span>
                        </div>
                        <input
                          ref="bgColorInputRef"
                          type="color"
                          v-model="localBgColor"
                          @change="handleBgColorChange"
                          class="color-picker-hidden"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-show="localBackgroundType === 'image'" class="background-image-config">
                    <div class="image-upload-section">
                      <label class="input-label">上传背景图片</label>
                      <div class="upload-area">
                        <input
                          ref="bgImageInput"
                          type="file"
                          accept="image/*"
                          @change="handleBackgroundImageUpload"
                          class="file-input"
                        />
                        <div class="upload-placeholder" @click="triggerBgImageUpload">
                          <svg
                            class="upload-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <polyline
                              points="17 8 12 3 7 8"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <line
                              x1="12"
                              y1="3"
                              x2="12"
                              y2="15"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <span class="upload-text">点击上传图片</span>
                          <span class="upload-hint">支持 JPG、PNG 格式，大小不超过 5MB</span>
                        </div>
                      </div>
                      <div v-if="localBackgroundImageUrl" class="image-preview">
                        <img
                          :src="localBackgroundImageUrl"
                          alt="Background Preview"
                          class="preview-image"
                          @error="handleImageError"
                        />
                        <a-button
                          type="danger"
                          size="small"
                          class="remove-image-btn"
                          @click="removeBackgroundImage"
                          >移除图片</a-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 全局配置 - 个人信息配置 -->
        <div v-show="activeTab === 'personal-info'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">个人信息配置</h2>
            <p class="section-desc">管理您的个人资料和网站头像</p>
          </div>

          <div class="config-list-full">
            <!-- 网站头像 -->
            <div class="config-card-full">
              <div class="card-header">
                <h3 class="card-title">网站头像</h3>
              </div>
              <div class="card-body">
                <p class="card-desc">上传和管理网站头像图片</p>
                <div class="avatar-display">
                  <div class="avatar-box">
                    <img
                      v-if="userForm.avatar"
                      :src="userForm.avatar"
                      alt="Avatar"
                      class="avatar-image"
                    />
                    <img v-else :src="avatarUrl" alt="Avatar" class="avatar-image" />
                  </div>
                </div>
                <div class="card-actions">
                  <input
                    ref="avatarInput"
                    type="file"
                    accept="image/*"
                    @change="handleAvatarUpload"
                    class="file-input"
                  />
                  <a-button type="primary" class="config-button" @click="triggerAvatarUpload">
                    <svg
                      class="button-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <polyline
                        points="17 8 12 3 7 8"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <line
                        x1="12"
                        y1="3"
                        x2="12"
                        y2="15"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    修改头像
                  </a-button>
                </div>
              </div>
            </div>

            <!-- 基本信息 -->
            <div class="config-card-full">
              <div class="card-header">
                <h3 class="card-title">基本信息</h3>
              </div>
              <div class="card-body">
                <p class="card-desc">编辑您的个人基本信息</p>
                <div class="form-grid">
                  <div class="form-item">
                    <label class="form-label">昵称</label>
                    <a-input
                      v-model:value="userForm.name"
                      placeholder="请输入昵称"
                      class="form-input"
                    />
                  </div>
                </div>
                <div class="form-grid">
                  <div class="form-item">
                    <label class="form-label">昵称</label>
                    <a-input
                      v-model:value="userForm.introduction"
                      placeholder="请输入您的简介"
                      class="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 兴趣爱好 -->
            <div class="config-card-full">
              <div class="card-header">
                <h3 class="card-title">首页兴趣爱好标签</h3>
                <a-button type="primary" size="small" @click="addInterest" class="add-button">
                  <svg
                    class="button-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  添加标签
                </a-button>
              </div>
              <div class="card-body">
                <p class="card-desc">添加您的兴趣爱好和擅长领域</p>
                <div class="interests-list">
                  <div
                    v-for="(interest, index) in userForm.interests"
                    :key="index"
                    class="interest-tag"
                  >
                    <span class="interest-text">{{ interest }}</span>
                    <button @click="removeInterest(index)" class="remove-btn">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18 6L6 18M6 6l12 12"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div v-if="userForm.interests.length === 0" class="empty-hint">
                    暂无兴趣爱好，点击上方按钮添加
                  </div>
                </div>
              </div>
            </div>

            <!-- 主题色设置 -->

            <!-- 操作按钮 -->
            <div class="config-actions">
              <a-button @click="resetUserForm" class="action-button">
                <svg
                  class="button-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 3v5h5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                重置
              </a-button>
              <a-button
                type="primary"
                @click="saveUserInfo"
                class="action-button"
                :loading="saving"
              >
                <svg
                  class="button-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                保存配置
              </a-button>
            </div>
          </div>
        </div>

        <!-- 页面配置 - 各页面配置详情 -->
        <div
          v-for="config in pageConfigs"
          :key="config.id"
          v-show="activeTab === 'page-' + config.id"
          class="content-section"
        >
          <div class="section-header">
            <h2 class="section-title">{{ config.name }}配置</h2>
            <p class="section-desc">{{ config.description }}</p>
          </div>

          <div class="page-config-detail">
            <!-- 页面开关 -->
            <div class="config-card-full">
              <div class="card-header">
                <h3 class="card-title">页面启用状态</h3>
                <a-switch
                  v-model:checked="config.enabled"
                  @change="handlePageConfigToggle(config.id, $event)"
                  class="custom-switch"
                />
              </div>
              <div class="card-body">
                <p class="card-desc">控制该页面是否在前台展示</p>
                <div class="status-display">
                  <span class="status-badge" :class="config.enabled ? 'enabled' : 'disabled'">
                    {{ config.enabled ? '已启用' : '已禁用' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 子配置项列表 -->
            <div v-if="config.subItems && config.subItems.length > 0" class="config-card-full">
              <div class="card-header">
                <h3 class="card-title">功能模块配置</h3>
              </div>
              <div class="card-body">
                <p class="card-desc">管理页面内的各个功能模块显示状态</p>
                <div class="sub-items-list">
                  <div v-for="subItem in config.subItems" :key="subItem.id" class="sub-item-row">
                    <div class="sub-item-info">
                      <span class="sub-item-name">{{ subItem.name }}</span>
                    </div>
                    <div class="sub-item-control">
                      <span class="status-tag" :class="subItem.enabled ? 'enabled' : 'disabled'">
                        {{ subItem.enabled ? '展示' : '关闭' }}
                      </span>
                      <a-switch
                        v-model:checked="subItem.enabled"
                        @change="handleSubItemToggle(config.id, subItem.id, $event)"
                        size="small"
                        class="custom-switch"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 编辑按钮 -->
            <div class="config-actions">
              <a-button type="primary" class="config-button" :disabled="!config.enabled">
                <svg
                  class="button-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                编辑{{ config.name }}配置
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Input, message } from 'ant-design-vue'
import { useGlobalSettingsStore } from '@/stores/globalSettings'
import { userAPI } from '@/lib/api'
import axios from 'axios'

const router = useRouter()
const store = useGlobalSettingsStore()

// 颜色选择器引用
const colorInputRef = ref<HTMLInputElement | null>(null)
const navbarColorInputRef = ref<HTMLInputElement | null>(null)
const bgColorInputRef = ref<HTMLInputElement | null>(null)
const bgImageInput = ref<HTMLInputElement | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)
const userColorInputRef = ref<HTMLInputElement | null>(null)

// Tab 状态管理
const activeTab = ref('color-config') // 'color-config' | 'personal-info' | 'page-xxx'

// 从 store 获取数据
const themeColor = computed(() => store.themeColor)
const themeBackground = computed(() => store.themeBackground)
const navbarConfig = computed(() => store.navbarConfig)
const avatarUrl = computed(() => store.avatarUrl)
const pageConfigs = computed(() => store.pageConfigs)
const selectedConfig = computed(() => store.selectedConfig)

// 本地状态用于双向绑定
const selectedConfigId = ref(pageConfigs.value[0]?.id || '')

// 主题颜色本地状态
const localPrimaryColor = ref(themeColor.value.primary)
const localHexColor = ref(themeColor.value.primary.replace('#', ''))

// 导航栏颜色本地状态
const localNavbarColor = ref(navbarConfig.value.backgroundColor)
const localNavbarHexColor = ref(navbarConfig.value.backgroundColor.replace('#', ''))

// 主题背景本地状态
const localBackgroundType = ref(themeBackground.value.type)
const localBgColor = ref(themeBackground.value.color)
const localBgHexColor = ref(themeBackground.value.color.replace('#', ''))
const localBackgroundImageUrl = ref(themeBackground.value.imageUrl)

// 用户信息表单
const userForm = ref({
  id: 0,
  username: '',
  name: '',
  email: '',
  avatar: '',
  mainColor: '#1890ff',
  introduction: '',
  interests: [] as string[],
})

// 用户主题色本地状态
const userFormMainColor = ref('#1890ff')
const userFormMainColorHex = ref('1890ff')

// 保存状态
const saving = ref(false)

// 获取主题色的计算属性（实时从 CSS 变量中读取）
const primaryColor = computed(() => {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() ||
    '#40e0d0'
  )
})

// 十六进制颜色转 RGBA
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 监听 store 变化，同步本地状态
watch(
  () => themeColor.value.primary,
  (newVal) => {
    localPrimaryColor.value = newVal
    localHexColor.value = newVal.replace('#', '')
  },
)

// 监听导航栏颜色变化
watch(
  () => navbarConfig.value.backgroundColor,
  (newVal) => {
    localNavbarColor.value = newVal
    localNavbarHexColor.value = newVal.replace('#', '')
  },
)

// 监听主题背景变化
watch(
  () => themeBackground.value,
  (newVal, oldVal) => {
    // 只在值真正变化时更新本地状态，避免循环更新
    if (newVal.type !== oldVal?.type) {
      localBackgroundType.value = newVal.type
    }
    if (newVal.color !== oldVal?.color) {
      localBgColor.value = newVal.color
      localBgHexColor.value = newVal.color.replace('#', '')
    }
    if (newVal.imageUrl !== oldVal?.imageUrl) {
      localBackgroundImageUrl.value = newVal.imageUrl
    }
  },
  { deep: true },
)

// 初始化选中第一个配置
onMounted(() => {
  if (pageConfigs.value.length > 0) {
    selectedConfigId.value = pageConfigs.value[0].id
    store.selectConfig(pageConfigs.value[0].id)
  }
  // 加载用户信息
  loadUserInfo()
})

// 选择页面配置
const selectPageConfig = (configId: string) => {
  activeTab.value = 'page-' + configId
  selectedConfigId.value = configId
  store.selectConfig(configId)
}

// 触发颜色选择器
const triggerColorPicker = () => {
  if (colorInputRef.value) {
    colorInputRef.value.click()
  }
}

// 触发导航栏颜色选择器
const triggerNavbarColorPicker = () => {
  if (navbarColorInputRef.value) {
    navbarColorInputRef.value.click()
  }
}

// 触发背景颜色选择器
const triggerBgColorPicker = () => {
  if (bgColorInputRef.value) {
    bgColorInputRef.value.click()
  }
}

// 触发背景图片上传
const triggerBgImageUpload = () => {
  if (bgImageInput.value) {
    bgImageInput.value.click()
  }
}

// 处理颜色变化
const handleColorChange = () => {
  localHexColor.value = localPrimaryColor.value.replace('#', '')
  store.updateThemeColor({
    primary: localPrimaryColor.value,
  })
}

const handleHexColorChange = (value: string) => {
  // 移除可能存在的 # 号和空格
  let hexValue = value.replace('#', '').trim()

  // 验证 16 进制颜色格式 (支持 3 位和 6 位)
  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localPrimaryColor.value = formattedColor
    localHexColor.value = hexValue.toUpperCase()
    store.updateThemeColor({
      primary: formattedColor,
    })
  } else {
    // 格式不正确时，只更新输入框，不更新 store 和色盘
    localHexColor.value = hexValue.toUpperCase()
  }
}

// 处理输入框失去焦点
const handleHexColorBlur = () => {
  let hexValue = localHexColor.value.replace('#', '').trim()

  // 验证 16 进制颜色格式 (支持 3 位和 6 位)
  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localPrimaryColor.value = formattedColor
    localHexColor.value = hexValue.toUpperCase()
    store.updateThemeColor({
      primary: formattedColor,
    })
  } else {
    // 格式不正确，恢复为之前的有效值
    message.warning('颜色格式不正确，请输入有效的十六进制颜色值')
    localHexColor.value = themeColor.value.primary.replace('#', '')
  }
}

// 处理导航栏颜色变化
const handleNavbarColorChange = () => {
  localNavbarHexColor.value = localNavbarColor.value.replace('#', '')
  store.updateNavbarConfig({
    backgroundColor: localNavbarColor.value,
  })
}

const handleNavbarHexColorChange = (value: string) => {
  let hexValue = value.replace('#', '').trim()

  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localNavbarColor.value = formattedColor
    localNavbarHexColor.value = hexValue.toUpperCase()
    store.updateNavbarConfig({
      backgroundColor: formattedColor,
    })
  } else {
    // 格式不正确时，只更新输入框
    localNavbarHexColor.value = hexValue.toUpperCase()
  }
}

// 处理导航栏输入框失去焦点
const handleNavbarHexColorBlur = () => {
  let hexValue = localNavbarHexColor.value.replace('#', '').trim()

  // 验证 16 进制颜色格式 (支持 3 位和 6 位)
  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localNavbarColor.value = formattedColor
    localNavbarHexColor.value = hexValue.toUpperCase()
    store.updateNavbarConfig({
      backgroundColor: formattedColor,
    })
  } else {
    // 格式不正确，恢复为之前的有效值
    message.warning('颜色格式不正确，请输入有效的十六进制颜色值')
    localNavbarHexColor.value = navbarConfig.value.backgroundColor.replace('#', '')
  }
}

// 处理背景颜色变化
const handleBgColorChange = () => {
  localBgHexColor.value = localBgColor.value.replace('#', '')
  updateBackground({
    type: 'color',
    color: localBgColor.value,
    imageUrl: '',
  })
}

const handleBgHexColorChange = (value: string) => {
  let hexValue = value.replace('#', '').trim()

  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localBgColor.value = formattedColor
    localBgHexColor.value = hexValue.toUpperCase()
    updateBackground({
      type: 'color',
      color: formattedColor,
      imageUrl: '',
    })
  } else {
    // 格式不正确时，只更新输入框
    localBgHexColor.value = hexValue.toUpperCase()
  }
}

// 处理背景输入框失去焦点
const handleBgHexColorBlur = () => {
  let hexValue = localBgHexColor.value.replace('#', '').trim()

  // 验证 16 进制颜色格式 (支持 3 位和 6 位)
  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    localBgColor.value = formattedColor
    localBgHexColor.value = hexValue.toUpperCase()
    updateBackground({
      type: 'color',
      color: formattedColor,
      imageUrl: '',
    })
  } else {
    // 格式不正确，恢复为之前的有效值
    message.warning('颜色格式不正确，请输入有效的十六进制颜色值')
    localBgHexColor.value = themeBackground.value.color.replace('#', '')
  }
}

// 处理背景类型变化
const handleBackgroundTypeChange = (value: any) => {
  if (value === 'color') {
    localBackgroundType.value = 'color'
    updateBackground({
      type: 'color',
      color: localBgColor.value,
      imageUrl: '',
    })
  } else if (value === 'image') {
    localBackgroundType.value = 'image'
    // 如果有图片 URL 则使用，否则保持空
    updateBackground({
      type: 'image',
      color: '',
      imageUrl: localBackgroundImageUrl.value || themeBackground.value.imageUrl,
    })
  }
}

// 处理背景图片 URL 变化
const handleBackgroundImageUrlChange = (value: string) => {
  updateBackground({
    type: 'image',
    color: '',
    imageUrl: value,
  })
}

// 处理背景图片上传
const handleBackgroundImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 文件类型校验
  if (!file.type.startsWith('image/')) {
    message.error('请选择图片文件（支持 JPG、PNG 等格式）')
    return
  }

  // 文件大小校验（5MB）
  if (file.size > 5 * 1024 * 1024) {
    message.error('图片大小不能超过 5MB')
    return
  }

  // 读取文件并转换为 Base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    localBackgroundImageUrl.value = result
    localBackgroundType.value = 'image' // 确保设置为 image 类型

    updateBackground({
      type: 'image',
      color: '',
      imageUrl: result,
    })

    message.success('背景图片上传成功')
  }
  reader.onerror = () => {
    message.error('图片读取失败')
  }
  reader.readAsDataURL(file)

  // 清空 input，允许重复选择同一文件
  target.value = ''
}

// 更新背景配置
const updateBackground = (background: { type: string; color: string; imageUrl: string }) => {
  store.updateThemeBackground({
    type: background.type as 'color' | 'image',
    color: background.color,
    imageUrl: background.imageUrl,
  })
}

// 处理图片加载错误
const handleImageError = () => {
  message.error('图片加载失败，请检查 URL 是否正确')
  localBackgroundImageUrl.value = ''
  updateBackground({
    type: 'color',
    color: localBgColor.value,
    imageUrl: '',
  })
}

// 移除背景图片
const removeBackgroundImage = () => {
  localBackgroundImageUrl.value = ''
  localBackgroundType.value = 'color' // 移除后切换回纯色背景
  updateBackground({
    type: 'color',
    color: localBgColor.value,
    imageUrl: '',
  })
  message.success('已移除背景图片')
}

// 恢复默认颜色
const resetToDefault = () => {
  const defaultColor = '#40E0D0'
  localPrimaryColor.value = defaultColor
  localHexColor.value = '40E0D0'
  store.updateThemeColor({
    primary: defaultColor,
  })
}

// 恢复导航栏默认颜色
const resetNavbarToDefault = () => {
  const defaultColor = '#FFFFFF'
  localNavbarColor.value = defaultColor
  localNavbarHexColor.value = 'FFFFFF'
  store.updateNavbarConfig({
    backgroundColor: defaultColor,
  })
}

// 恢复背景默认设置
const resetBackgroundToDefault = () => {
  const defaultColor = '#F5F5F0'
  localBackgroundType.value = 'color'
  localBgColor.value = defaultColor
  localBgHexColor.value = 'F5F5F0'
  localBackgroundImageUrl.value = ''
  store.updateThemeBackground({
    type: 'color',
    color: defaultColor,
    imageUrl: '',
  })
}

const handlePageConfigToggle = (configId: string, checked: boolean) => {
  store.togglePageConfig(configId, checked)
}

// 选择配置项
const selectConfig = (configId: string) => {
  selectedConfigId.value = configId
  store.selectConfig(configId)
}

// 新增：页面 Tab 点击处理
const handlePageTabClick = (configId: string) => {
  activeTab.value = 'page-' + configId
  selectConfig(configId)
}

// 新增：子配置项开关处理
const handleSubItemToggle = (configId: string, subItemId: string, checked: boolean) => {
  store.toggleSubItem(configId, subItemId, checked)
}

// ========== 用户信息管理相关函数 ==========

// 触发头像上传
const triggerAvatarUpload = () => {
  if (avatarInput.value) {
    avatarInput.value.click()
  }
}

// 处理头像上传
const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 文件类型校验
  if (!file.type.startsWith('image/')) {
    message.error('请选择图片文件（支持 JPG、PNG 等格式）')
    return
  }

  // 文件大小校验（5MB）
  if (file.size > 5 * 1024 * 1024) {
    message.error('图片大小不能超过 5MB')
    return
  }

  try {
    // 使用 FormData 上传文件
    const formData = new FormData()
    formData.append('image', file)

    const response = await axios.post('http://localhost:5000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      const imageUrl = `http://localhost:5000${response.data.url}`
      userForm.value.avatar = imageUrl
      message.success('头像上传成功')
    }
  } catch (error: any) {
    console.error('上传头像失败:', error)
    message.error(error.response?.data?.error || '上传失败，请重试')
  }

  // 清空 input，允许重复选择同一文件
  target.value = ''
}

// 触发用户颜色选择器
const triggerUserColorPicker = () => {
  if (userColorInputRef.value) {
    userColorInputRef.value.click()
  }
}

// 处理用户颜色变化
const handleUserColorChange = () => {
  userFormMainColorHex.value = userFormMainColor.value.replace('#', '')
  userForm.value.mainColor = userFormMainColor.value
}

// 处理用户颜色输入框失去焦点
const handleUserColorBlur = () => {
  let hexValue = userFormMainColorHex.value.replace('#', '').trim()

  // 验证 16 进制颜色格式 (支持 3 位和 6 位)
  if (/^[0-9A-Fa-f]{3,6}$/.test(hexValue)) {
    // 如果是 3 位简写，扩展为 6 位
    if (hexValue.length === 3) {
      hexValue = hexValue
        .split('')
        .map((c) => c + c)
        .join('')
    }
    const formattedColor = '#' + hexValue.toUpperCase()
    userFormMainColor.value = formattedColor
    userFormMainColorHex.value = hexValue.toUpperCase()
    userForm.value.mainColor = formattedColor
  } else {
    // 格式不正确，恢复为之前的有效值
    message.warning('颜色格式不正确，请输入有效的十六进制颜色值')
    userFormMainColorHex.value = userForm.value.mainColor.replace('#', '')
  }
}

// 添加兴趣
const addInterest = () => {
  // 这里可以添加一个弹窗让用户输入兴趣
  // 简化处理：添加一个默认兴趣
  const newInterest = prompt('请输入兴趣爱好：')
  if (newInterest && newInterest.trim()) {
    userForm.value.interests.push(newInterest.trim())
  }
}

// 移除兴趣
const removeInterest = (index: number) => {
  userForm.value.interests.splice(index, 1)
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    // 这里假设当前登录用户 ID 为 1，实际应该从登录状态中获取
    const userId = 1
    const response = await userAPI.getById(userId)

    if (response.data) {
      userForm.value = {
        id: response.data.id || 0,
        username: response.data.username || '',
        name: response.data.name || '',
        email: response.data.email || '',
        avatar: response.data.avatar || '',
        mainColor: response.data.mainColor || '#1890ff',
        introduction: response.data.introduction || '',
        interests: response.data.interests || [],
      }
      userFormMainColor.value = response.data.mainColor || '#1890ff'
      userFormMainColorHex.value = (response.data.mainColor || '#1890ff').replace('#', '')
    }
  } catch (error: any) {
    console.error('加载用户信息失败:', error)
    // 如果加载失败，使用默认值
  }
}

// 重置用户表单
const resetUserForm = () => {
  loadUserInfo()
  message.info('已重置为原始数据')
}

// 保存用户信息
const saveUserInfo = async () => {
  try {
    saving.value = true

    // 验证必填项
    if (!userForm.value.name) {
      message.warning('请输入昵称')
      return
    }

    // 验证邮箱格式
    if (userForm.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.value.email)) {
      message.error('请输入有效的邮箱地址')
      return
    }

    // 更新表单数据
    userForm.value.mainColor = userFormMainColor.value

    // 调用后端 API 更新用户信息
    const response = await userAPI.update(userForm.value.id, userForm.value)

    if (response.data) {
      message.success('保存成功')
      // 更新全局 store 中的头像
      if (userForm.value.avatar) {
        store.updateAvatar(userForm.value.avatar)
      }
    }
  } catch (error: any) {
    console.error('保存失败:', error)
    message.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/profile')
}

// ========== 配色推荐功能 ==========

/**
 * 应用配色方案
 * @param primary 主题色 (最下面的色块)
 * @param navbar 导航栏色 (中间的色块)
 * @param background 背景色 (最上面的色块)
 */
const applyColorScheme = (primary: string, navbar: string, background: string) => {
  // 应用主题色
  localPrimaryColor.value = primary
  localHexColor.value = primary.replace('#', '')
  store.updateThemeColor({
    primary: primary,
  })

  // 应用导航栏颜色
  localNavbarColor.value = navbar
  localNavbarHexColor.value = navbar.replace('#', '')
  store.updateNavbarConfig({
    backgroundColor: navbar,
  })

  // 应用背景颜色
  localBgColor.value = background
  localBgHexColor.value = background.replace('#', '')
  localBackgroundType.value = 'color'
  store.updateThemeBackground({
    type: 'color',
    color: background,
    imageUrl: '',
  })

  message.success('配色方案应用成功！')
}
</script>

<style scoped>
.global-settings {
  min-height: calc(100vh - 60px);
  background: #f5f5f0;
}

.page-header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

/* 左右布局容器 */
.settings-layout {
  display: flex;
  max-width: 1600px;
  margin: 0 auto;
  min-height: calc(100vh - 140px);
}

/* 左侧侧边栏 */
.settings-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e8e8e8;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.nav-group-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  padding: 0 0.75rem;
}

.nav-icon {
  width: 18px;
  height: 18px;
  color: v-bind(primaryColor);
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 0.95rem;
  color: #555;
  font-weight: 500;
}

.nav-item:hover {
  background: #f5f5f0;
  color: #333;
}

.nav-item.active {
  background: v-bind(hexToRgba(primaryColor, 0.1));
  color: v-bind(primaryColor);
  font-weight: 600;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
  transition: all 0.25s ease;
}

.nav-item.active .nav-dot {
  opacity: 1;
  transform: scale(1.2);
}

.sidebar-footer {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid #f0f0f0;
}

/* 右侧内容区域 */
.settings-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.content-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid v-bind(primaryColor);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.section-desc {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

/* 配置卡片样式 */
.config-list-full {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-card-full {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.config-card-full:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: v-bind(hexToRgba(primaryColor, 0.3));
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-desc {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* 主题颜色编辑器 */
.theme-color-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
  align-items: start;
}

.color-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
}

.hash-symbol {
  color: #999;
  font-weight: 600;
}

.color-picker-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-palette {
  height: 100px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.color-palette:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.palette-text {
  background: rgba(255, 255, 255, 0.95);
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-picker-hidden {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* 背景配置 */
.background-config {
  margin-top: 1rem;
}

.background-type-selector {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.type-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
}

.theme-radio-group :deep(.ant-radio-button-wrapper) {
  color: #666;
}

.theme-radio-group :deep(.ant-radio-button-wrapper-checked) {
  background: v-bind(primaryColor);
  border-color: v-bind(primaryColor);
  color: white;
}

.theme-radio-group :deep(.ant-radio-button-wrapper:hover) {
  color: v-bind(primaryColor);
}

/* 图片上传 */
.upload-area {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.upload-placeholder {
  border: 2px dashed #d9d9d9;
  border-radius: 10px;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-placeholder:hover {
  border-color: v-bind(primaryColor);
  background: v-bind(hexToRgba(primaryColor, 0.05));
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #bbb;
  margin-bottom: 1rem;
}

.upload-text {
  display: block;
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.upload-hint {
  display: block;
  font-size: 0.85rem;
  color: #999;
}

.image-preview {
  margin-top: 1rem;
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

/* 头像显示 */
.avatar-display {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  display: inline-block;
}

.avatar-box {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.avatar-image:hover {
  transform: scale(1.05);
  border-color: v-bind(primaryColor);
}

.card-actions {
  margin-top: 1rem;
}

/* 页面配置详情 */
.page-config-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-display {
  margin-top: 0.5rem;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.status-badge.enabled {
  background: linear-gradient(
    135deg,
    v-bind(primaryColor) 0%,
    v-bind(hexToRgba(primaryColor, 0.8)) 100%
  );
  color: white;
}

.status-badge.disabled {
  background: #e9ecef;
  color: #999;
}

/* 子配置项列表 */
.sub-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.sub-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.sub-item-row:hover {
  background: #f0f0f0;
}

.sub-item-name {
  font-size: 0.95rem;
  color: #444;
  font-weight: 500;
}

.sub-item-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-tag.enabled {
  background: linear-gradient(
    135deg,
    v-bind(primaryColor) 0%,
    v-bind(hexToRgba(primaryColor, 0.8)) 100%
  );
  color: white;
}

.status-tag.disabled {
  background: #e9ecef;
  color: #999;
}

.config-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

/* 按钮样式 */
.config-button {
  background: linear-gradient(
    135deg,
    v-bind(primaryColor) 0%,
    v-bind(hexToRgba(primaryColor, 0.8)) 100%
  );
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.config-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px v-bind(hexToRgba(primaryColor, 0.4));
}

.config-button:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-icon {
  width: 16px;
  height: 16px;
}

.reset-button {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  color: #666;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.reset-button:hover {
  color: v-bind(primaryColor);
  border-color: v-bind(primaryColor);
  background: v-bind(hexToRgba(primaryColor, 0.05));
  transform: translateY(-1px);
}

.reset-icon {
  width: 14px;
  height: 14px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.7rem;
  background: white;
  color: v-bind(primaryColor);
  border: 1.5px solid v-bind(primaryColor);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: v-bind(primaryColor);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px v-bind(hexToRgba(primaryColor, 0.3));
}

.back-icon {
  width: 16px;
  height: 16px;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .settings-layout {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
    padding: 1rem;
  }

  .nav-items {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .nav-item {
    flex: 1;
    min-width: 140px;
    justify-content: center;
  }

  .sidebar-footer {
    margin-top: 1rem;
  }

  .theme-color-editor {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.4rem;
  }

  .settings-content {
    padding: 1rem;
  }

  .config-card-full {
    padding: 1rem;
  }
}

/* ========== 个人信息配置样式 ========== */

/* 表单网格布局 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-item-full {
  margin-top: 1rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
}

.form-input {
  width: 100%;
}

.form-textarea {
  width: 100%;
  font-size: 0.95rem;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
}

.form-textarea:hover {
  border-color: var(--primary-color);
}

.form-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(64, 224, 208, 0.2);
}

/* 兴趣爱好列表 */
.interests-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  min-height: 60px;
}

.interest-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
  border-radius: 20px;
  transition: all 0.3s ease;
  border: none;
  cursor: default;
}

.interest-tag:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #d8d8d8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.interest-text {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #999;
}

.remove-btn:hover {
  background: rgba(255, 0, 0, 0.1);
  color: #ff4d4f;
  transform: scale(1.1);
}

.remove-btn svg {
  width: 14px;
  height: 14px;
}

.empty-hint {
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

/* 添加按钮 */
.add-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.add-button .button-icon {
  width: 14px;
  height: 14px;
}

/* 文件输入 */
.file-input {
  display: none;
}

/* 操作按钮组 */
.config-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e8e8e8;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 0.95rem;
}

.action-button .button-icon {
  width: 16px;
  height: 16px;
}

/* 头像显示优化 */
.avatar-display {
  margin-bottom: 1.5rem;
}

.avatar-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar-image:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .config-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }

  .interests-list {
    justify-content: center;
  }
}

/* ========== 配色推荐功能样式 ========== */
.color-scheme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.color-scheme-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid transparent;
}

.color-scheme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: v-bind(primaryColor);
}

.scheme-preview {
  height: 100px;
  display: flex;
  overflow: hidden;
}

.scheme-color {
  flex: 1;
  transition: all 0.3s ease;
  position: relative;
}

.scheme-color:first-child {
  flex: 1.2;
}

.scheme-color:hover {
  flex: 1.5;
}

.scheme-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scheme-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.scheme-name::before {
  content: '🎨';
  font-size: 1.2rem;
}

.scheme-colors {
  font-size: 0.85rem;
  color: #888;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

/* 响应式优化 */
@media (max-width: 1024px) {
  .color-scheme-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .color-scheme-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .scheme-preview {
    height: 100px;
  }
}
</style>
