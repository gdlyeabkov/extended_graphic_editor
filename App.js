import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, SafeAreaView , View, ScrollView, Text, Pressable, Dimensions, Button, Keyboard, ToastAndroid, DrawerLayoutAndroid, TouchableOpacity, Image, Environment } from 'react-native'
import Canvas from 'react-native-canvas'
import { FontAwesome5, Entypo, Fontisto, MaterialCommunityIcons, MaterialIcons, Ionicons, Foundation, Feather, SimpleLineIcons, FontAwesome } from '@expo/vector-icons'
import {
  Checkbox,
  Dialog, TextInput
} from 'react-native-paper'
import SelectDropdown from 'react-native-select-dropdown'
import Slider from '@react-native-community/slider'
import { ColorPicker } from 'react-native-color-picker'
import * as MaterialMenu from 'react-native-material-menu'
import { getImgFromArr, getDataUrlFromArr } from 'array-to-image'
// import 'text-encoding-polyfill'
import * as encoding from 'text-encoding'
// import RNFetchBlob from 'rn-fetch-blob'
// import RNFetchBlob from 'react-native-fetch-blob'
// var RNFetchBlob = require('rn-fetch-blob').default
import * as FileSystem from 'expo-file-system'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export default function App() {
  
  // const testActivity = 'MainActivity'
  // const testActivity = 'GalleryActivity'
  const testActivity = 'StartActivity'
  // const testActivity = 'CreateCanvasActivity'

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={testActivity}>
        <Stack.Screen
          name="MainActivity"
          component={MainActivity}
          options={{
            title: 'Softtrack Графический редактор'
          }}
        />
        <Stack.Screen
          name="GalleryActivity"
          component={GalleryActivity}
          options={{
            title: 'Моя галерея'
          }}
        />
        <Stack.Screen
          name="StartActivity"
          component={StartActivity}
          options={{
            title: ''
          }}
        />
        <Stack.Screen
          name="CreateCanvasActivity"
          component={CreateCanvasActivity}
          options={{
            title: 'Новый холст'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export function GalleryActivity() {
  
  const [docsList, setDocsList] = useState([])

  const _getAllFilesInDirectory = async() => {
    let dir = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory)
    dir.map(async (val) => {
      console.log(`FileSystem.cacheDirectory + val: ${FileSystem.cacheDirectory + val}`)
      const fileUri = FileSystem.cacheDirectory + val
      const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 })
      const info = await FileSystem.getInfoAsync(fileUri)
      const fileUriParts = fileUri.split('/')
      const fileUriPartsLength = fileUriParts.length
      const lastFileUriPartIndex = fileUriPartsLength - 1
      const fileName = fileUriParts[lastFileUriPartIndex]
      const docInfo = {
        content: content,
        info: info,
        name: fileName
      }
      console.log(info)
      if (fileName.includes('.png')) {
        docsList.push(docInfo)
      }
    })
  }
  
  useEffect(() => _getAllFilesInDirectory(), [])

  _getAllFilesInDirectory()

  const getParsedDate = (modificationTime) => {
    const currentDateTime = new Date()
    currentDateTime.setMilliseconds(modificationTime)
    const year = currentDateTime.getFullYear()
    const monthIndex = currentDateTime.getMonth()
    // const month = monthIndex + 1
    const month = currentDateTime.getMonth()
    const day = currentDateTime.getDate()
    const hours = currentDateTime.getHours()
    const minutes = currentDateTime.getMinutes()
    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  return (
    <ScrollView>
      {
        docsList.map((doc, docIndex) => {
          return (
            <View
              key={docIndex}
              style={styles.galleryActivityContainerItem}
            >
              <Image
                width="200"
                height="200"
                style={{
                  width: 200,
                  height: 200,
                  minWidth: 200,
                  minHeight: 200,
                  borderWidth: 1,
                  borderColor: 'rgb(0, 0, 0)',
                  backgroundColor: 'rgb(255, 255, 255)'
                }}
                // source={{uri: doc.info.uri}}
                source={{uri:'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fgraphic_editor-3dec9138-7521-40a1-a173-5dadabf73790/extended_graphic_editor_export.png'}}
              />
              <Text>
                {
                  getParsedDate(doc.info.modificationTime)
                }
              </Text>
              <Text>
                {
                  `${
                    doc.info.size / 1024 / 1024 > 0 ?
                      `${(doc.info.size / 1024 / 1024).toFixed(2)} MB`
                    : doc.info.size / 1024 > 0 ?
                      `${doc.info.size / 1024} KB`
                    : `${doc.info.size.toFixed(2)} B`
                  }`
                }
              </Text>
              <View
                style={styles.galleryActivityContainerItemFooter}
              >
                <FontAwesome5
                  name="trash"
                  size={24}
                  color="black"
                  style={styles.galleryActivityContainerItemFooterElement}
                />
                <Feather
                  name="more-vertical"
                  size={24}
                  color="black"
                  style={styles.galleryActivityContainerItemFooterElement}
                />
              </View>
            </View>
          )
        })
      }
    </ScrollView>
  )
}

export function MainActivity() {
  
  const [ctx, setCtx] = useState(null)
  
  const [tool, setTool] = useState('pen')

  const [initialTouch, setInitialTouch] = useState({
    x: 0,
    y: 0
  })

  const [curvePointsCursor, setCurvePointsCursor] = useState(-1)

  const [curvePoints, setCurvePoints] = useState([
    {
      x: 0,
      y: 0
    },
    {
      x: 0,
      y: 0
    },
    {
      x: 0,
      y: 0
    }
  ])

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

  const [curve, setCurve] = useState('rect')

  const [shape, setShape] = useState('rect')

  const palleteDrawer = useRef(null)
  
  const [palleteDrawerPosition, setPalleteDrawerPosition] = useState('left')

  const [primaryColor, setPrimaryColor] = useState('')

  const palleteNavigationView = () => (
    <View style={{
      padding: 25,
      display: 'flex',
      flexDirecton: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}>
      <Text>
        Палитра
      </Text>
      <ColorPicker
        onColorSelected={color => setPrimaryColor(color)}
        // style={styles.colorpiker}
      />
    </View>
  )
  
  const layersDrawer = useRef(null)
  
  const [layersDrawerPosition, setLayersDrawerPosition] = useState('right')

  const [activeLayer, setActiveLayer] = useState(0)

  const [layers, setLayers] = useState([
    {
      name: 'Слой 1',
      visibility: true
    },
    {
      name: 'Слой 2',
      visibility: true
    },
  ])

  const [isSelectionContextMenuVisible, setIsSelectionContextMenuVisible] = useState(false)

  const [isEditContextMenuVisible, setIsEditContextMenuVisible] = useState(false)

  const [isToggleOrientationContextMenuVisible, setIsToggleOrientationContextMenuVisible] = useState(false)

  const [imgUri, setImgUri] = useState('')

  const getActiveLayerStyle = (layerIndex) => {
    if (activeLayer === layerIndex) {
      return {
        backgroundColor: 'rgb(235, 235, 235)'
      }
    }
    return {
      backgroundColor: 'rgb(255, 255, 255)'
    }
  }

  const layersNavigationView = () => (
    <View style={{
      padding: 25,
      display: 'flex',
      flexDirecton: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}>
      <Text>
        Слои
      </Text>
      <View
        style={styles.layers}
      >
        {
          layers.map((layer, layerIndex) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setActiveLayer(layerIndex)
                }}
                style={[
                  styles.layer,
                  getActiveLayerStyle(layerIndex)
                ]}
              >
                <View
                  style={styles.layerAside}
                >
                  <Entypo
                    name="eye"
                    size={24}
                    color={
                      layer.visibility ?
                        'black'
                      :
                        'rgb(200, 200, 200)'
                    }
                    style={styles.layerAsideItem}
                    onPress={() => {
                      const updatedLayers = layers
                      updatedLayers[layerIndex].visibility = !updatedLayers[layerIndex].visibility
                      setLayers(updatedLayers)
                    }}
                  />
    
                  <Fontisto
                    name="rectangle"
                    size={24}
                    color="black"
                    style={styles.layerAsideItem}
                  />
                  <Text
                    style={styles.layerAsideItem}
                  >
                    {
                      layer.name
                    }
                  </Text>
                </View>
                <Ionicons
                  name="settings-sharp"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )
          })
        }
      </View>
    </View>
  )

  const materialsDrawer = useRef(null)
  
  const [materialsDrawerPosition, setMaterialsDrawerPosition] = useState('right')

  const materialsNavigationView = () => (
    <View style={{
      padding: 25,
      display: 'flex',
      flexDirecton: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}>
      <Text>
        Материалы
      </Text>
    </View>
  )

  const showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.LONG)
  }

  const handleCanvas = async (canvas) => {
    try {
      if (!isInit) {
        setCtx(canvas.getContext('2d'))
        canvas.width = Dimensions.get('window').width
        canvas.height = Dimensions.get('window').height - 250
        
        // ctx.fillStyle = 'rgb(0, 0, 0)'
        // ctx.fillRect(0, 0, 1000, 1000)
        // let imageData = await ctx.getImageData(60, 60, 200, 100)
        // ctx.putImageData(imageData, 150, 10)
        // var bmp = new Bitmap(150, 150)
        // var url = bmp.dataURL()
        // console.log(`url: ${url}`)
        // console.log(`data: ${imageData.data}`)
        // setImgUri(imageData.data)
        // const dataUrl = getDataUrlFromArr(imageData.data, canvas.width, canvas.height)
        // console.log(`dataUrl: ${dataUrl}`)
        // await setImgUri(dataUrl)

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

  const onCanvasTouchMove = async (event) => {
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
      const isPathCurve = curve === 'path'
      const isRectCurve = curve === 'rect'
      const isOvalCurve = curve === 'oval'
      const isPolygoneCurve = curve === 'polygone'
      if (isRectCurve) {
        ctx.strokeRect(initialTouch.x, initialTouch.y, x - initialTouch.x, y - initialTouch.y)
      } else if (isOvalCurve) {
        // ctx.arc(initialTouch.x, initialTouch.y, 50, 0, 2 * Math.PI, false)
        drawEllipse(ctx, initialTouch.x, initialTouch.y, x - initialTouch.x, y - initialTouch.y)
        ctx.stroke()
      } else if (isPolygoneCurve) {
        ctx.moveTo(curvePoints[0].x, curvePoints[0].y)
        ctx.quadraticCurveTo(curvePoints[1].x, curvePoints[1].y, curvePoints[2].y, curvePoints[2].y)
        ctx.stroke()
      }
    } else if (isSelectTool) {
      
    } else if (isShapeTool) {
      const nativeEvent = event.nativeEvent
      const x = nativeEvent.pageX
      const y = nativeEvent.pageY
      ctx.clearRect(0, 0, 1000, 1000)
      const isRectShape = shape === 'rect'
      const isOvalShape = shape === 'oval'
      const isPolygoneShape = shape === 'polygone'
      if (isRectShape) {
        ctx.fillRect(initialTouch.x, initialTouch.y, x - initialTouch.x, y - initialTouch.y)
      } else if (isOvalShape) {
        drawEllipse(ctx, initialTouch.x, initialTouch.y, x - initialTouch.x, y - initialTouch.y)
        ctx.fill()
      } else if (isPolygoneShape) {
        ctx.moveTo(curvePoints[0].x, curvePoints[0].y)
        ctx.quadraticCurveTo(curvePoints[1].x, curvePoints[1].y, curvePoints[2].y, curvePoints[2].y)
        ctx.fill()
      }
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
      if (curve === 'polygone') {
        setCurvePointsCursor(curvePointsCursor + 1)
        const updatedCurvePoints = curvePoints
        updatedCurvePoints[curvePointsCursor] = {
          x: initialTouch.x,
          y: initialTouch.y
        }
        setCurvePoints(updatedCurvePoints)
        if (curvePointsCursor >= 2) {
          setCurvePointsCursor(-1)
          ctx.closePath()
        }
      } else {
        ctx.closePath()
      }
    } else if (isSelectTool) {
      console.log('выбираю кривую')
      
    } else if (isShapeTool) {
      if (shape === 'polygone') {
        setCurvePointsCursor(curvePointsCursor + 1)
        const updatedCurvePoints = curvePoints
        updatedCurvePoints[curvePointsCursor] = {
          x: initialTouch.x,
          y: initialTouch.y
        }
        setCurvePoints(updatedCurvePoints)
        if (curvePointsCursor >= 2) {
          setCurvePointsCursor(-1)
          ctx.closePath()
        }
      } else {
        ctx.closePath()
      }
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

  const saveFile = async (content) => {
    const savedFileName = 'extended_graphic_editor_export.png'
    // let fileUri = FileSystem.cacheDirectory + savedFileName
    let fileUri = FileSystem.cacheDirectory + savedFileName
    console.log(`create fileUri: ${fileUri}`)
    await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 })
    showToast('Сохранение завершено')
  }

  function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2       // y-middle
  
    ctx.beginPath()
    ctx.moveTo(x, ym)
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y)
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym)
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym)
    ctx.stroke()
  }

  useEffect(() => {
    // let imageData = ctx.getImageData(60, 60, 200, 100)
    // ctx.putImageData(imageData, 150, 10)
  }, [])

  return (
    <>
      <DrawerLayoutAndroid
        ref={palleteDrawer}
        drawerWidth={300}
        drawerPosition={palleteDrawerPosition}
        renderNavigationView={palleteNavigationView}
      >
        <DrawerLayoutAndroid
          ref={layersDrawer}
          drawerWidth={300}
          drawerPosition={layersDrawerPosition}
          renderNavigationView={layersNavigationView}
        >
          <DrawerLayoutAndroid
            ref={materialsDrawer}
            drawerWidth={300}
            drawerPosition={materialsDrawerPosition}
            renderNavigationView={materialsNavigationView}
          >
            <SafeAreaView>
              {/* <Image
                source={imgUri}
                style={{
                  width: 150,
                  height: 150
                }}
              /> */}
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
              {
                (tool === 'pen' || tool === 'eraser') ?
                  <View>
                    <View>
                      <Button
                        title="Коррекция 0"
                      />
                    </View>
                  </View>
                : tool === 'curve' ?
                  <View
                    style={styles.toolBarMenu}
                  >
                    <MaterialCommunityIcons
                      name="vector-polyline"
                      size={24}
                      color="black"
                      style={styles.toolBarMenuItem}
                      onPress={() => {
                        console.log('выбираю кривую')
                        setCurve('path')
                      }}
                    />
                    <MaterialCommunityIcons
                      name="vector-polyline"
                      size={24}
                      color="black"
                      style={styles.toolBarMenuItem}
                      onPress={() => {
                        console.log('выбираю кривую')
                        setCurve('path')
                      }}
                    />
                    <MaterialCommunityIcons
                      name="vector-polyline"
                      size={24}
                      color="black"
                      style={styles.toolBarMenuItem}
                      onPress={() => {
                        console.log('выбираю кривую')
                        setCurve('path')
                      }}
                    />
                    <MaterialCommunityIcons
                      name="rectangle-outline"
                      size={24}
                      color="black"
                      style={styles.toolBarMenuItem}
                      onPress={() => {
                        console.log('выбираю кривую')
                        setCurve('rect')
                      }}
                    />
                    <Entypo
                      name="circle"
                      size={24}
                      color="black"
                      style={styles.toolBarMenuItem}
                      onPress={() => {
                        console.log('выбираю кривую')
                        setCurve('oval')
                      }}
                    />
                    <MaterialCommunityIcons
                      name="pentagon-outline"
                      size={24}
                      color="black"
                      style={styles.toolBarMenuItem}
                      onPress={() => {
                        console.log('выбираю кривую')
                        setCurve('polygone')
                      }}
                    />
                  </View>
                : tool === 'shape' ?
                  <View
                    style={styles.toolBarMenu}
                  >
                    <Fontisto
                      name="rectangle"
                      size={24}
                      color="black"
                      style={styles.toolBarMenuItem}
                      onPress={() => {
                        console.log('выбираю кривую')
                        setShape('rect')
                      }}
                    />
                    <MaterialCommunityIcons
                      name="checkbox-blank-circle"
                      size={24}
                      color="black"
                      style={styles.toolBarMenuItem}
                      onPress={() => {
                        console.log('выбираю кривую')
                        setShape('oval')
                      }}
                    />
                    <MaterialCommunityIcons
                      name="pentagon"
                      size={24}
                      color="black"
                      style={styles.toolBarMenuItem}
                      onPress={() => {
                        console.log('выбираю кривую')
                        setShape('polygone')
                      }}
                    />
                  </View>
                :
                  <View>

                  </View>
              }
              <Pressable
                style={[styles.canvas,
                  {
                  borderTopWidth: 1,
                  borderTopColor: 'red'
                }
              ]}
                onTouchStart={onCanvasTouchStart}
                onTouchMove={onCanvasTouchMove}
                onTouchEnd={onCanvasTouchEnd}
              >
                <Canvas
                  ref={handleCanvas}
                /> 
              </Pressable>
              <View
                style={styles.toolBarPreFooter}
              >
                <Ionicons
                  name="arrow-undo-sharp"
                  size={24}
                  color="black"
                  style={styles.toolBarPreFooterItem}
                />
                <Ionicons
                  name="arrow-redo-sharp"
                  size={24}
                  color="black"
                  style={styles.toolBarPreFooterItem}
                />
                <MaterialCommunityIcons
                  name="format-color-highlight"
                  size={24}
                  color="black"
                  style={styles.toolBarPreFooterItem}
                />
                <FontAwesome5
                  name="pen"
                  size={24}
                  color="black"
                  style={styles.toolBarPreFooterItem}
                  onPress={() => {
                    console.log('выбираю инстумент ручка')
                    setTool('pen')
                  }}
                />
                <Entypo
                  name="eraser"
                  size={24}
                  color="black"
                  style={styles.toolBarPreFooterItem}
                  onPress={() => {
                    console.log('выбираю инстумент ластик')
                    setTool('eraser')
                  }}
                />
                <SimpleLineIcons
                  name="share-alt"
                  size={24}
                  color="black"
                  style={styles.toolBarPreFooterItem}
                />
                <View
                  style={styles.toolBarPreFooterItem}
                >
                  <Button
                    title="Сохр."
                    onPress={async () => {
                      const uint8array = await ctx.getImageData(60, 60, 200, 100)
                      const string = new encoding.TextDecoder('utf-8').decode(uint8array)
                      console.log(`string: ${string}`)
                      saveFile(string)
                    }}
                  />
                </View>
                <Ionicons
                  name="apps-sharp"
                  size={24}
                  color="black"
                  style={styles.toolBarPreFooterItem}
                />
              </View>
              <View
                style={styles.toolBarFooter}
              >
                <Entypo
                  name="menu"
                  size={24}
                  color="black"
                  style={styles.toolBarFooterItem}
                />
                <Feather
                  name="edit"
                  size={24}
                  color="black"
                  style={styles.toolBarFooterItem}
                  onPress={() => setIsEditContextMenuVisible(true)}
                />
                <MaterialMenu.Menu
                  onRequestClose={() => setIsEditContextMenuVisible(false)}
                  visible={isEditContextMenuVisible}
                >
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsEditContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Копия
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsEditContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Вырезать
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsEditContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Вставить
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsEditContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Повернуть холст влево
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsEditContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Повернуть холст
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsEditContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Повернуть холст по
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsEditContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Настройки холста
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsEditContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Обрезка
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                </MaterialMenu.Menu>
                <MaterialCommunityIcons
                  name="selection"
                  size={24}
                  color="black"
                  style={styles.toolBarFooterItem}
                  onPress={() => setIsSelectionContextMenuVisible(true)}
                />
                <MaterialMenu.Menu
                  onRequestClose={() => setIsSelectionContextMenuVisible(false)}
                  visible={isSelectionContextMenuVisible}
                >
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsSelectionContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Сохранить все
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsSelectionContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Отменить выбор
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsSelectionContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Инвертировать
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsSelectionContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Выбрать область
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsSelectionContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Уменьшить/Увеличть
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsSelectionContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Свободная трансформация
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsSelectionContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Преобразование
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsSelectionContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Создать границу
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                </MaterialMenu.Menu>
                <MaterialIcons
                  name="screen-rotation"
                  size={24}
                  color="black"
                  style={styles.toolBarFooterItem}
                  onPress={() => setIsToggleOrientationContextMenuVisible(true)}
                />
                <MaterialMenu.Menu
                  onRequestClose={() => setIsToggleOrientationContextMenuVisible(false)}
                  visible={isToggleOrientationContextMenuVisible}
                >
                  <MaterialMenu.MenuItem
                    onPress={async () => {
                      setIsToggleOrientationContextMenuVisible(false)
                      
                      // await ctx.rotate(20 * Math.PI / 180)
                      // ctx.save()
                      await ctx.rotate(180)
                      // ctx.restore()
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Поворот влево
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsToggleOrientationContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Поворот вправо
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsToggleOrientationContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Отразить по горизонтали
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                  <MaterialMenu.MenuItem
                    onPress={() => {
                      setIsToggleOrientationContextMenuVisible(false)
                    }}
                  >
                    <View
                      style="gridViewContextMenuItem"
                    >
                      <MaterialCommunityIcons
                        name="selection"
                        size={24}
                        color="black"
                      />
                      <Text>
                        Сброс
                      </Text>
                    </View>
                  </MaterialMenu.MenuItem>
                </MaterialMenu.Menu>
                <MaterialCommunityIcons
                  name="rectangle"
                  size={24}
                  color="black"
                  style={styles.toolBarFooterItem}
                />
                <Ionicons
                  name="color-palette"
                  size={24}
                  color="black"
                  style={styles.toolBarFooterItem}
                />
                <MaterialIcons
                  name="layers"
                  size={24}
                  color="black"
                  style={styles.toolBarFooterItem}
                />
                <Entypo
                  name="circle"
                  size={24}
                  color="black"
                  style={styles.toolBarFooterItem}
                />
              </View>
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
          </DrawerLayoutAndroid>
        </DrawerLayoutAndroid>
      </DrawerLayoutAndroid>
    </>
  )
}

export function CreateCanvasActivity({ navigation }) {
  
  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }
  
  return (
    <View
      style={styles.createCanvasActivityContainer}
    >
      <Text
        style={styles.createCanvasActivityContainerHeader}
      >
        Размер холста
      </Text>
      <Text
        style={styles.createCanvasActivityContainerWidthLabel}
      >
        Ширина 1007px
      </Text>
      <View
        style={styles.createCanvasActivityContainerRow}
      >
        <View
          style={styles.createCanvasActivityContainerRowAside}
        >
          <Text
            style={styles.createCanvasActivityContainerRowAsideHeightLabel}
          >
            Высота 1414px
          </Text>
          <Text
            style={styles.createCanvasActivityContainerRowAsideDpiLabel}
          >
            точек на дюйм 350
          </Text>
        </View>
        <View
          style={styles.createCanvasActivityContainerRowEditBtn}
        >
          <Button
            title="РЕДАКИРОВАТЬ"
          />
        </View>
      </View>
      <View
        style={styles.createCanvasActivityContainerCreateBtn}
      >
        <Button
          title="СОЗД"
          onPress={() => goToActivity(navigation, 'MainActivity')}
        />
      </View>
    </View>
  )
}

export function StartActivity({ navigation }) {
  
  const goToActivity = (navigation, activityName, params = {}) => {
    navigation.navigate(activityName, params)
  }
  
  return (
    <View
      style={styles.startActivityContainer}
    >
      <Text
        style={styles.startActivityContainerSendLabel}
      >
        Давайте порисуем
      </Text>
      <View
        style={styles.startActivityContainerSend}
      >
        <TouchableOpacity
          style={styles.startActivityContainerDrawItem}
          onPress={() => goToActivity(navigation, 'CreateCanvasActivity')}
        >
          <View
            style={styles.startActivityContainerSendItemPhoto}
          >
            <Entypo name="brush" size={50} color="rgb(255, 255, 255)" />
          </View>
          <Text
            style={styles.startActivityContainerSendItemLabel}
          >
            {
              'Новый холст'
            }
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.startActivityContainerDrawItem}
          onPress={() => goToActivity(navigation, 'CreateCanvasActivity')}
        >
          <View
            style={styles.startActivityContainerSendItemPhoto}
          >
            <MaterialCommunityIcons
              name="draw"
              size={50}
              color="rgb(255, 255, 255)"
            />
          </View>
          <Text
            style={styles.startActivityContainerSendItemLabel}
          >
            {
              'Прошлый'
            }
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.startActivityContainerDrawItem}
          onPress={() => goToActivity(navigation, 'GalleryActivity')}
        >
          <View
            style={styles.startActivityContainerSendItemPhoto}
          >
            <Ionicons name="attach" size={50} color="rgb(255, 255, 255)" />
          </View>
          <Text
            style={styles.startActivityContainerSendItemLabel}
          >
            {
              'Моя галерея'
            }
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Button
          title="Библиотека Softtrack Графический редактор"
        />
      </View>
      <Text
        style={styles.startActivityContainerSendLabel}
      >
        Отправить Работу
      </Text>
      <View
        style={styles.startActivityContainerSend}
      >
        <View
          style={styles.startActivityContainerSendItem}
        >
          <View
            style={styles.startActivityContainerSendItemPhoto}
          >
            <Ionicons name="attach" size={50} color="rgb(255, 255, 255)" />
          </View>
          <Text
            style={styles.startActivityContainerSendItemLabel}
          >
            {
              'Отправить\nработу'
            }
          </Text>
        </View>
        <View
          style={styles.startActivityContainerSendItem}
        >
          <View
            style={styles.startActivityContainerSendItemPhoto}
          >
            <Feather
              name="award"
              size={50}
              color="rgb(255, 255, 255)"
            />
          </View>
          <Text
            style={styles.startActivityContainerSendItemLabel}
          >
            {
              'Примите\nучастие в\nконкурсе'
            }
          </Text>
        </View>
        <View
          style={styles.startActivityContainerSendItem}
        >
          <View
            style={styles.startActivityContainerSendItemPhoto}
          >
            <Ionicons name="attach" size={50} color="rgb(255, 255, 255)" />
          </View>
          <Text
            style={styles.startActivityContainerSendItemLabel}
          >
            {
              'Всеобщее\'ы\nискусство'
            }
          </Text>
        </View>
      </View>
    </View>
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
  },
  toolBarMenu: {
    display: 'flex',
    flexDirection: 'row'
  },
  toolBarMenuItem: {
    marginHorizontal: 15    
  },
  toolBarPreFooter: {
    display: 'flex',
    flexDirection: 'row'
  },
  toolBarPreFooterItem: {
    marginHorizontal: 12
  },
  toolBarFooter: {
    display: 'flex',
    flexDirection: 'row'
  },
  toolBarFooterItem: {
    marginHorizontal: 15
  },
  layers: {
    width: '100%'    
  },
  layer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  layerAside: {
    display: 'flex',
    flexDirection: 'row'
  },
  layerAsideItem: {
    marginHorizontal: 10
  },
  gridViewContextMenuItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  galleryActivityContainerItem: {
    width: '50%'
  },
  galleryActivityContainerItemFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  galleryActivityContainerItemFooterElement: {
    marginHorizontal: 15
  },
  startActivityContainerDrawLabel: {
    fontSize: 24
  },
  startActivityContainerSendLabel: {
    fontSize: 24
  },
  startActivityContainerSend: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  startActivityContainerSendItem: {
    padding: 10,
    width: 125,
    backgroundColor: 'rgb(255, 0, 0)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  startActivityContainerSendItemPhoto: {

  },
  startActivityContainerSendItemLabel: {
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  },
  startActivityContainerDrawItem: {
    padding: 10,
    width: 125,
    backgroundColor: 'rgb(0, 100, 255)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'    
  },
  createCanvasActivityContainer: {

  },
  createCanvasActivityContainerHeader: {
    fontSize: 20
  },
  createCanvasActivityContainerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  createCanvasActivityContainerRowAside: {
    display: 'flex',
    flexDirection: 'column',
  },
  createCanvasActivityContainerRowAsideHeightLabel: {

  },

  createCanvasActivityContainerRowAsideDpiLabel: {

  },
  createCanvasActivityContainerRowEditBtn: {

  },
  createCanvasActivityContainerCreateBtn: {
    width: '75%'
  }
})
