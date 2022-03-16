import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, SafeAreaView , View, ScrollView, Text, Pressable, Dimensions, Button, Keyboard, ToastAndroid } from 'react-native'
import Canvas from 'react-native-canvas'
import { FontAwesome5, Entypo, Fontisto, MaterialCommunityIcons, MaterialIcons, Ionicons, Foundation, Feather } from '@expo/vector-icons'
import {
  Checkbox,
  Dialog, TextInput
} from 'react-native-paper'
import SelectDropdown from 'react-native-select-dropdown'
import Slider from '@react-native-community/slider'
import { ColorPicker } from 'react-native-color-picker'

export default function App() {
  return (
    <MainActivity />
  )
}

export function MainActivity() {
  
  const [ctx, setCtx] = useState(null)
  
  const [tool, setTool] = useState('pen')

  const [initialTouch, setInitialTouch] = useState({
    x: 0,
    y: 0
  })

  const [isTextToolDialogVisible, setIsTextToolDialogVisible] = useState(false)

  const [isInit, setIsInit] = useState(false)

  const [textToolDialogContent, setTextToolDialogContent] = useState('')

  const textToolDialogFonts = [
    'serif',
    'arial'
  ]
  const [textToolDialogFont, setTextToolDialogFont] = useState('serif')

  const [isTextToolDialogBold, setIsTextToolDialogBold] = useState(false)

  const [isTextToolDialogItalic, setIsTextToolDialogItalic] = useState(false)

  const [isTextToolDialogSmooth, setIsTextToolDialogSmooth] = useState('18')

  const [textToolDialogFontSize, setTextToolDialogFontSize] = useState('0')

  var textToolDialogFontSizeRef = useRef(null)

  const [textToolDialogSpace, setTextToolDialogSpace] = useState('0')

  const [textToolDialogLineHeight, setTextToolDialogLineHeight] = useState('0')

  const [textToolDialogRotationDegress, setTextToolDialogRotationDegress] = useState('0')

  const [textToolDialogOutlineWidth, setTextToolDialogOutlineWidth] = useState('0')

  const [isTextToolDialogRoundOutline, setIsTextToolDialogRoundOutline] = useState(false)

  const [textToolDialogColorPickerTextColor, setTextToolDialogColorPickerTextColor] = useState('')

  const [textToolDialogColorPickerTextTempColor, setTextToolDialogColorPickerTextTempColor] = useState('')

  const [isTextToolDialogColorPickerVisible, setIsTextToolDialogColorPickerVisible] = useState(false)

  const [textToolDialogColorPickerTextOutlineColor, setTextToolDialogColorPickerTextOutlineColor] = useState('')

  const [textToolDialogColorPickerTextOutlineTempColor, setTextToolDialogColorPickerTextOutlineTempColor] = useState('')

  const [isTextToolDialogColorPickerOutlineVisible, setIsTextToolDialogColorPickerOutlineVisible] = useState(false)

  const showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.LONG)
  }

  const handleCanvas = (canvas) => {
    try {
      setCtx(canvas.getContext('2d'))
      if (!isInit) {
        canvas.width = Dimensions.get('window').width
        canvas.height = Dimensions.get('window').height
        setIsInit(true)
      }
    } catch (e) {
      console.log(`Ошибка получения контекста: ${e}`)
    }
  }
  
  const onCanvasTouchStart = (event) => {
    const isPenTool = tool === 'pen'
    const isEraserTool = tool === 'eraser'
    const isHandTool = tool === 'hand'
    const isCurveTool = tool === 'curve'
    const isSelectTool = tool === 'select'
    const isShapeTool = tool === 'shape'
    const isFillTool = tool === 'fill'
    const isGradientTool = tool === 'gradient'
    const isTextTool = tool === 'text'
    if (isPenTool) {
      console.log('открываем кривую')
      ctx.strokeStyle = 'rgb(0, 0, 0)'
      ctx.lineWidth = 1.0
      ctx.beginPath()
    } else if (isEraserTool) {
      console.log('открываем кривую')
      ctx.strokeStyle = 'rgb(255, 255, 255)'
      ctx.lineWidth = 10.0
      ctx.beginPath()
    } else if (isHandTool) {
      console.log('смещаем канвас')
      
    } else if (isCurveTool) {
      console.log('открываем кривую')
      const nativeEvent = event.nativeEvent
      const x = nativeEvent.pageX
      const y = nativeEvent.pageY
      setInitialTouch({
        x,
        y
      })
      ctx.strokeStyle = 'rgb(0, 0, 0)'
      ctx.lineWidth = 1.0
      ctx.beginPath()
    } else if (isSelectTool) {
      console.log('выбираю кривую')
      const nativeEvent = event.nativeEvent
      const x = nativeEvent.pageX
      const y = nativeEvent.pageY
      
    } else if (isShapeTool) {
      console.log('открываем кривую')
      const nativeEvent = event.nativeEvent
      const x = nativeEvent.pageX
      const y = nativeEvent.pageY
      setInitialTouch({
        x,
        y
      })
      ctx.fillStyle = 'rgb(0, 0, 0)'
      ctx.lineWidth = 1.0
      ctx.beginPath()
    } else if (isTextTool) {
      console.log('добавляем положение для текста')
      const nativeEvent = event.nativeEvent
      const x = nativeEvent.pageX
      const y = nativeEvent.pageY
      setInitialTouch({
        x,
        y
      })
    }
  }

  const onCanvasTouchMove = (event) => {
    const isPenTool = tool === 'pen'
    const isEraserTool = tool === 'eraser'
    const isHandTool = tool === 'hand'
    const isCurveTool = tool === 'curve'
    const isSelectTool = tool === 'select'
    const isShapeTool = tool === 'shape'
    const isFillTool = tool === 'fill'
    const isGradientTool = tool === 'gradient'
    const isTextTool = tool === 'text'
    if (isPenTool) {
      const nativeEvent = event.nativeEvent
      const x = nativeEvent.pageX
      const y = nativeEvent.pageY
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if (isEraserTool) {
      const nativeEvent = event.nativeEvent
      const x = nativeEvent.pageX
      const y = nativeEvent.pageY
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if (isHandTool) {

    } else if (isCurveTool) {
      const nativeEvent = event.nativeEvent
      const x = nativeEvent.pageX
      const y = nativeEvent.pageY
      ctx.clearRect(0, 0, 1000, 1000)
      ctx.strokeRect(initialTouch.x, initialTouch.y, x - initialTouch.x, y - initialTouch.y)
    } else if (isSelectTool) {
      
    } else if (isShapeTool) {
      const nativeEvent = event.nativeEvent
      const x = nativeEvent.pageX
      const y = nativeEvent.pageY
      ctx.clearRect(0, 0, 1000, 1000)
      ctx.fillRect(initialTouch.x, initialTouch.y, x - initialTouch.x, y - initialTouch.y)
    } else if (isFillTool) {
      ctx.fillRect(0, 0, 1000, 1000)
    }
  }

  const onCanvasTouchEnd = () => {
    const isPenTool = tool === 'pen'
    const isEraserTool = tool === 'eraser'
    const isHandTool = tool === 'hand'
    const isCurveTool = tool === 'curve'
    const isSelectTool = tool === 'select'
    const isShapeTool = tool === 'shape'
    const isFillTool = tool === 'fill'
    const isGradientTool = tool === 'gradient'
    const isTextTool = tool === 'text'
    if (isPenTool) {
      console.log('закрываем кривую')
      ctx.closePath()
    } else if (isEraserTool) {
      console.log('закрываем кривую')
      ctx.closePath()
    } else if (isHandTool) {
      console.log('останавливаем смещение канваса')
      
    } else if (isCurveTool) {
      console.log('закрываем кривую')
      ctx.closePath()
    } else if (isSelectTool) {
      console.log('выбираю кривую')
      
    } else if (isShapeTool) {
      console.log('закрываем кривую')
      ctx.closePath()
    } else if (isFillTool) {
      ctx.fillStyle = 'rgb(0, 0, 0)'
      ctx.fillRect(0, 0, 1000, 1000)
    } else if (isGradientTool) {
      ctx.clearRect(0, 0, 1000, 1000)
      ctx.createLinearGradient(0, 0, 1000, 1000).then((gradient) => {
        gradient.addColorStop(0, 'black')
        gradient.addColorStop(1, 'white')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 1000, 1000)
      })
    } else if (isTextTool) {
      setIsTextToolDialogVisible(true)
    }
  }

  return (
    <SafeAreaView>
      <Pressable
        style={styles.canvas}
        onTouchStart={onCanvasTouchStart}
        onTouchMove={onCanvasTouchMove}
        onTouchEnd={onCanvasTouchEnd}
      >
        <Canvas
          ref={handleCanvas}
        /> 
      </Pressable>
      <ScrollView
        horizontal={true}
        style={styles.toolBar}
      >
        <FontAwesome5
          name="pen"
          size={24}
          color="black"
          style={styles.toolBarItem}
          onPress={() => {
            console.log('выбираю инстумент ручка')
            setTool('pen')
          }}
        />
        <Entypo
          name="eraser"
          size={24}
          color="black"
          style={styles.toolBarItem}
          onPress={() => {
            console.log('выбираю инстумент ластик')
            setTool('eraser')
          }}
        />
        <Entypo
          name="hand"
          size={24}
          color="black"
          style={styles.toolBarItem}
          onPress={() => {
            console.log('выбираю инстумент рука')
            setTool('hand')
          }}
        />
        <MaterialCommunityIcons
          name="rectangle-outline"
          size={24}
          color="black"
          style={styles.toolBarItem}
          onPress={() => {
            console.log('выбираю инстумент кривая')
            setTool('curve')
          }}
        />
        <Fontisto
          name="cursor"
          size={24}
          color="black"
          style={styles.toolBarItem}
          onPress={() => {
            console.log('выбираю инстумент Выбор')
            setTool('select')
          }}
        />
        <Fontisto
          name="rectangle"
          size={24}
          color="black"
          style={styles.toolBarItem}
          onPress={() => {
            console.log('выбираю инстумент фигура')
            setTool('shape')
          }}
        />
        <Ionicons
          name="md-color-fill"
          size={24}
          color="black"
          style={styles.toolBarItem}
          onPress={() => {
            console.log('выбираю инстумент заливка')
            setTool('fill')
          }}
        />
        <MaterialIcons
          name="gradient"
          size={24}
          color="black"
          style={styles.toolBarItem}
          onPress={() => {
            console.log('выбираю инстумент градиент')
            setTool('gradient')
          }}
        />
        <Ionicons
          name="text"
          size={24}
          color="black"
          style={styles.toolBarItem}
          onPress={() => {
            console.log('выбираю инстумент текст')
            setTool('text')
          }}
        />
      </ScrollView>
      <Dialog
        visible={isTextToolDialogVisible}
        onDismiss={() => {
          setIsTextToolDialogVisible(false)
          setTextToolDialogContent('')
          setTextToolDialogFontSize(18)
          setIsTextToolDialogBold(false)
          setIsTextToolDialogItalic(false)
        }}>
        <Dialog.Title>
        
        </Dialog.Title>
        <Dialog.Content>
          <ScrollView
            height={350}
          >
            <Text>
              Текст
            </Text>
            <View
              style={styles.dialogContentRow}
            >
              <TextInput
                width={200}
                value={textToolDialogContent}
                multiline
                onChangeText={(value) => setTextToolDialogContent(value)}
              />
              <FontAwesome5
                name="microphone"
                size={24}
                color="black"
                onPress={() => showToast('В настоящее время фукнция\nголосового набора\nне используется')}
              />
              <Entypo
                name="keyboard"
                size={24}
                color="black"
                onPress={() => Keyboard.dismiss()}
              />
            </View>
            <Text>
              Шрифт
            </Text>
            <SelectDropdown
              defaultButtonText={'serif'}
              data={textToolDialogFonts}
              onSelect={(selectedItem, index) => {
                setTextToolDialogFont(selectedItem)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                return item
              }}
              style={styles.addAmountActivityContainerDropDown}
              renderDropdownIcon={() => <Entypo name="chevron-down" size={24} color="black" />}
            />
            <View
              style={styles.dialogContentRow}
            >
              <MaterialCommunityIcons
                name="rectangle"
                size={24}
                color="black"
                onPress={() => setIsTextToolDialogColorPickerVisible(true)}
              />
              <MaterialIcons name="format-align-left" size={24} color="black" />
              <MaterialIcons name="format-align-center" size={24} color="black" />
              <MaterialIcons name="format-align-right" size={24} color="black" />
              <Foundation
                name="bold"
                size={24}
                color={
                  isTextToolDialogBold ?
                    'rgb(0, 0, 0)'
                  :
                    'rgb(200, 200, 200)'
                }
                onPress={() => setIsTextToolDialogBold(!isTextToolDialogBold)}
              />
              <Feather
                name="italic"
                size={24}
                color={
                  isTextToolDialogItalic ?
                    'rgb(0, 0, 0)'
                  :
                    'rgb(200, 200, 200)'
                }
                onPress={() => setIsTextToolDialogItalic(!isTextToolDialogItalic)}
              />
              <Ionicons name="text-outline" size={24} color="black" />
            </View>
            <View
              style={styles.dialogContentRow}
            >
              <Checkbox
                isChecked={isTextToolDialogSmooth}
                onClick={() => setIsTextToolDialogSmooth(!isTextToolDialogSmooth)}
              />
              <Text>
                Сглаживание
              </Text>
            </View>
            <Text>
              {
                `Размер текста ${textToolDialogFontSize} pt`
              }
            </Text>
            <Slider
              style={{width: 315, height: 40}}
              ref={(ref) => {
                textToolDialogFontSizeRef = ref
              }}
              onValueChange={(value) => {
                const parsedFontSize = Number.parseInt(value)
                setTextToolDialogFontSize(parsedFontSize)
              }}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="rgb(150, 150, 150)"
              maximumTrackTintColor="rgb(150, 150, 150)"
            />
            <Text>
              {
                `Текстовое пространство ${textToolDialogSpace}`
              }
            </Text>
            <Slider
              style={{width: 315, height: 40}}
              onValueChange={(value) => {
                const parsedSpace = Number.parseInt(value)
                setTextToolDialogSpace(parsedSpace)
              }}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="rgb(150, 150, 150)"
              maximumTrackTintColor="rgb(150, 150, 150)"
            />
            <Text>
              {
                `Междустрочный интервал ${textToolDialogLineHeight}`
              }
            </Text>
            <Slider
              style={{width: 315, height: 40}}
              onValueChange={(value) => {
                const parsedLineHeight = Number.parseInt(value)
                setTextToolDialogLineHeight(parsedLineHeight)
              }}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="rgb(150, 150, 150)"
              maximumTrackTintColor="rgb(150, 150, 150)"
            />
            <Text>
              Градус поворота
            </Text>
            <View
              style={styles.dialogContentRow}
            >
              <TextInput
                value={textToolDialogRotationDegress}
                width={100}
                onChangeText={(value) => setTextToolDialogRotationDegress(value)}
              />
              <MaterialIcons name="text-rotation-none" size={24} color="black" />
              <MaterialIcons name="text-rotation-down" size={24} color="black" />
              <MaterialCommunityIcons name="format-text-rotation-up" size={24} color="black" />
            </View>
            <View
              style={styles.dialogContentRow}
            >
              <View>
                <Text>
                  Цвет края
                </Text>
                <MaterialCommunityIcons
                  name="rectangle"
                  size={24}
                  color="black"
                  onPress={() => setIsTextToolDialogColorPickerOutlineVisible(true)}
                />
              </View>
              <View>
                <Text>
                  {
                    `Ширина края ${textToolDialogOutlineWidth} px`
                  }
                </Text>
                <Slider
                  style={{width: 215, height: 40}}
                  onValueChange={(value) => {
                    const parsedOutlineWidth = Number.parseInt(value)
                    setTextToolDialogOutlineWidth(parsedOutlineWidth)
                  }}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="rgb(150, 150, 150)"
                  maximumTrackTintColor="rgb(150, 150, 150)"
                />
                <View
                  style={styles.dialogContentRow}
                >
                  <Checkbox
                    isChecked={isTextToolDialogRoundOutline}
                    onClick={() => setIsTextToolDialogRoundOutline(!isTextToolDialogRoundOutline)}
                  />
                  <Text>
                    Круглые края
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Dialog.Content>

        <Dialog.Actions>
          <Button
            title="ОТМЕНА"
            onPress={() => {
              setIsTextToolDialogVisible(false)
              setTextToolDialogContent('')
              setTextToolDialogFontSize(18)
              setIsTextToolDialogBold(false)
              setIsTextToolDialogItalic(false)
            }}
          />
          <Button
            title="ЗАДАТЬ"
            onPress={() => {
              // ctx.font = 'bold 48px serif'
              ctx.font = `${isTextToolDialogItalic ? 'italic ' : ''} ${isTextToolDialogBold ? 'bold ' : ''} ${textToolDialogFontSize}pt serif`
              ctx.fillStyle = `${textToolDialogColorPickerTextColor}`
              ctx.fillText(textToolDialogContent, initialTouch.x, initialTouch.y)
              setIsTextToolDialogVisible(false)
              setTextToolDialogContent('')
              setTextToolDialogFontSize(18)
              setIsTextToolDialogBold(false)
              setIsTextToolDialogItalic(false)
              setTextToolDialogColorPickerTextColor('')
              setTextToolDialogColorPickerTextTempColor('')
              setTextToolDialogColorPickerTextOutlineColor('')
              setTextToolDialogColorPickerTextOutlineTempColor('')
            }}
          />
        </Dialog.Actions>
      </Dialog>
      <Dialog
        visible={isTextToolDialogColorPickerVisible}
        onDismiss={() => setIsTextToolDialogColorPickerVisible(false)}>
        <Dialog.Title>
          
        </Dialog.Title>
        <Dialog.Content>
          <View
            style={styles.colorPickerWrap}
          >

          </View>
          <ColorPicker
            onColorSelected={color => setTextToolDialogColorPickerTextTempColor(color)}
            style={styles.colorpiker}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            title="ОТМЕНА"
            onPress={() => {
              showToast(`ОТМЕНА`)
              setIsTextToolDialogColorPickerVisible(false)
            }}
          />
          <Button
            title="ОК"
            onPress={() => {
              setIsTextToolDialogColorPickerVisible(false)
              setTextToolDialogColorPickerTextColor(textToolDialogColorPickerTextTempColor)
            }}
          />
        </Dialog.Actions>
      </Dialog>
      <Dialog
        visible={isTextToolDialogColorPickerOutlineVisible}
        onDismiss={() => setIsTextToolDialogColorPickerOutlineVisible(false)}>
        <Dialog.Title>
          
        </Dialog.Title>
        <Dialog.Content>
          <View
            style={styles.colorPickerWrap}
          >

          </View>
          <ColorPicker
            onColorSelected={color => setTextToolDialogColorPickerTextOutlineTempColor(color)}
            style={styles.colorpiker}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            title="ОТМЕНА"
            onPress={() => {
              showToast(`ОТМЕНА`)
              setIsTextToolDialogColorPickerOutlineVisible(false)
            }}
          />
          <Button
            title="ОК"
            onPress={() => {
              setIsTextToolDialogColorPickerOutlineVisible(false)
              setTextToolDialogColorPickerTextOutlineColor(textToolDialogColorPickerTextOutlineTempColor)
            }}
          />
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  toolBar: {
    paddingTop: 0,
    paddingHorizontal: 25,
  },
  toolBarItem: {
    marginHorizontal: 25
  },
  dialogContentRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 15
  },
  colorPickerWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  colorpiker:{
    width: '75%',
    height: '75%'
  }
})
