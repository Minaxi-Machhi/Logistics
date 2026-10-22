<template>
  <div class="login-container">
    <div class="left-pane">
      <v-img src="@/assets/login-art.svg" cover class="absolute-bg" alt="" />
      <div class="left-content">
        <div class="text-overline font-weight-medium text-primary mb-2">TRANSPORT MANAGEMENT</div>
        <h1 class="hero-title mb-4">Orders, trips and billing in one place</h1>
        <p class="text-body-1 opacity-80 max-w-600 mb-0">
          FTL, FCL and LTL bookings, vendors, drivers, vehicles, invoices and incentives for your whole network.
        </p>
      </div>
    </div>

    <div class="right-pane">
      <v-card class="login-card pa-8 rounded-lg" flat border max-width="420">
        <div class="d-flex align-center gap-3 mb-6">
          <img src="@/assets/logo-lg.svg" alt="Logistics" width="40" height="40" style="border-radius: 10px">
          <div>
            <div class="text-h6 font-weight-medium line-height-tight">Logistics</div>
            <div class="text-caption text-medium-emphasis">Sign in to continue</div>
          </div>
        </div>

        <v-form ref="formRef" @submit.prevent="signIn">
          <v-text-field
            v-model="username"
            label="Username"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            autocomplete="username"
            :rules="[required]"
          />
          <v-text-field
            v-model="password"
            label="Password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            autocomplete="current-password"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            :rules="[required]"
            @click:append-inner="show = !show"
          />
          <v-btn type="submit" color="primary" variant="flat" size="large" block class="rounded-lg text-none font-weight-bold mt-1">
            Sign in
          </v-btn>
        </v-form>

        <v-divider class="my-5" />
        <v-btn variant="text" block class="text-none" prepend-icon="mdi-account-circle-outline" @click="customerDemo">
          Open the customer portal demo
        </v-btn>
        <div class="text-caption text-disabled text-center mt-3">Demo build: any username and password signs in.</div>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { selectRole } from '@/state'

const router = useRouter()
const formRef = ref(null)
const username = ref('logistics')
const password = ref('')
const show = ref(false)

const required = v => !!v || 'Required'

async function signIn () {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  selectRole('admin')
  router.push('/app/dashboard')
}

function customerDemo () {
  selectRole('customer')
  router.push('/customer')
}
</script>

<style scoped>
.login-container { display: flex; height: 100vh; width: 100vw; overflow: hidden; background-color: rgb(var(--v-theme-background)); }
.left-pane { display: flex; align-items: flex-end; padding: 56px; position: relative; overflow: hidden; flex: 0 0 60%; max-width: 60%; height: 100%; color: #fff; background: #0f2233; }
.absolute-bg { position: absolute !important; inset: 0; z-index: 0; }
.left-content { position: relative; z-index: 1; width: 100%; }
.hero-title { font-size: 40px; line-height: 1.15; font-weight: 600; max-width: 560px; text-wrap: balance; }
.right-pane { display: flex; align-items: center; justify-content: center; padding: 24px; flex: 1 1 40%; height: 100%; background-color: rgb(var(--v-theme-background)); }
.login-card { width: 100%; }
.line-height-tight { line-height: 1.2; }
.max-w-600 { max-width: 600px; }
.font-mono { font-family: var(--v-font-mono, 'IBM Plex Mono', monospace); }
@media (max-width: 959px) {
  .left-pane { display: none; }
  .right-pane { flex: 0 0 100%; }
}
</style>
