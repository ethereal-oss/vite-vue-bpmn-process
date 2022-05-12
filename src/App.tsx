import { defineComponent, computed, ref, watchEffect } from 'vue'
import Toolbar from '@/components/Toolbar'
import Palette from '@/components/Palette'
import Designer from '@/components/Designer'
import Penal from '@/components/Penal'
import Setting from '@/components/Setting'
import { EditorSettings } from 'types/editor/settings'
import { defaultSettings } from '@/config'
import Logger from '@/utils/Logger'
import { NConfigProvider, NMessageProvider } from 'naive-ui'

const logger = new Logger()

const App = defineComponent({
  setup() {
    const editorSettings = ref<EditorSettings>({ ...defaultSettings })

    const processXml = ref<string | undefined>(undefined)

    const customPalette = computed<boolean>(() => editorSettings.value.paletteMode === 'custom')
    const customPenal = computed<boolean>(() => editorSettings.value.penalMode === 'custom')
    const showToolbar = computed<boolean>(() => editorSettings.value.toolbar)

    const computedClasses = computed<Object>(() => {
      const baseClass = ['designer-container']

      customPalette.value && baseClass.push('designer-with-palette')

      customPenal.value && baseClass.push('designer-with-penal')

      editorSettings.value.bg === 'grid-image' && baseClass.push('designer-with-bg')
      editorSettings.value.bg === 'image' && baseClass.push('designer-with-image')

      return baseClass.join(' ')
    })

    /* 测试功能部分 */
    watchEffect(() => {
      logger.printBack('success', '[Process Designer XML change]')
    })

    /* 组件渲染 */
    return () => (
      <div class={computedClasses.value} id="designer-container">
        <NConfigProvider abstract componentOptions={{ DynamicInput: { buttonSize: 'small' } }}>
          <NMessageProvider>
            {showToolbar.value && <Toolbar></Toolbar>}
            <div class="main-content">
              {customPalette.value && <Palette></Palette>}
              <Designer settings={editorSettings.value} v-model={[processXml.value, 'xml']}></Designer>
              {customPenal.value ? <Penal></Penal> : <div class="camunda-penal" id="camunda-penal"></div>}
            </div>
            <Setting v-model={[editorSettings, 'settings']}></Setting>
          </NMessageProvider>
        </NConfigProvider>
      </div>
    )
  }
})

export default App