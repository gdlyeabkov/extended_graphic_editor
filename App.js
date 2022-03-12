import React, { useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView , View, ScrollView, Text, Pressable, Dimensions, Button } from 'react-native'
import Canvas from 'react-native-canvas'
import { FontAwesome5, Entypo, Fontisto, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons'
import {
  Dialog
} from 'react-native-paper'

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

  const handleCanvas = (canvas) => {
    try {
      setCtx(canvas.getContext('2d'))
      // canvas.width = Dimensions.get('window').width
      // canvas.height = Dimensions.get('window').height
      // canvas.width = 1000
      // canvas.height = 1000
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

    } else if (isGradientTool) {
      ctx.clearRect(0, 0, 1000, 1000)
      const gradient = ctx.createLinearGradient(0, 0, 1000, 1000)
      // gradient.addColorStop(0, 'black')
      // gradient.addColorStop(1, 'white')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 100, 100)
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
        onDismiss={() => setIsTextToolDialogVisible(false)}>
        <Dialog.Title>
          Статистика
        </Dialog.Title>
        <Dialog.Content>
          <Text>
            Количество символов
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            title="ОТМЕНА"
            onPress={() => {
              setIsTextToolDialogVisible(false)
            }}
          />
          <Button
            title="ОК"
            onPress={() => {
              setIsTextToolDialogVisible(false)
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
  }
})
