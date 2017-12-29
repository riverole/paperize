import Promise from 'bluebird'
import jsPDF from 'jspdf'
import store from '../../store'
import _ from 'lodash'

// To get image data from our local store
const fetchDataByName = function(name) {
  return store.getters.findImageByName(name).then(asset => asset.data)
}

const fetchImageByName = function(name) {
  return fetchDataByName(name)

  .then((imageDataURI) => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = function() {
        resolve(image)
      }
      image.src = imageDataURI
    })
  })
}

// To get CORS-enabled images from the web
const toDataURL = function(url) {
  return fetch(url)

  .then(response => {
    return response.blob()
  })

  .then(blob => {
    return URL.createObjectURL(blob)
  })
}

const api = {
  renderItemToPdf(game, component, item) {
    const doc = this.startNewDocument()
    this.addPage(doc, component)

    return this.renderItem(doc, game, component, item).then(() => {
      return doc.output('bloburi')
    })
  },

  // renderComponentToPdf(game, component) {
  //   const doc = this.startNewDocument()
  //   const items = this.sortItems(component)
  //
  //   return Promise.each(items, (item) => {
  //     addPage(doc, template, game)
  //     return this.renderItem(doc, template, item, items, game)
  //   }).then(() => {
  //     return doc.output('bloburi')
  //   })
  // },

  renderGameToPdf(game) {
    const doc = this.startNewDocument()
    const components = game.components // this.sortComponents(game)

    return Promise.each(components, (component) => {
      const items = store.getters.getComponentItems(component)

      return Promise.each(items, (item) => {
        this.addPage(doc, component)
        return this.renderItem(doc, game, component, item)
      })
    }).then(() => {
      return doc.save("game.pdf") //output('bloburi')
    })
  },

  startNewDocument() {
    // Set units
    const doc = new jsPDF({ unit: 'in' })
    // Clear the auto-generated page
    doc.deletePage(1)

    return doc
  },

  addPage(doc, component) {
    // game or template knows page settings?
    // template.pageArguments?
    // doc.apply('addPage', template.pageArguments)
    doc.addPage(component.template.size.w, component.template.size.h)
  },

  restoreDocumentDefaults(doc) {
    doc.setFontSize(16)
  },

  renderItem(doc, game, component, item) {
    // get transforms for this component
    const layers = component.template.layers
    // render each transform upon this item
    console.log(`Rendering ${layers.length} layers...`)


    let helpers = {
      // Guide box
      drawGuideBox(dimensions) {
        doc.setLineWidth(.02)
        doc.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
      },

      findProperty(key) {
        return _.find(item, { key }).value || ""
      },

      text(fontSize, text, x, y) {
        doc.setFontSize(fontSize)
        doc.text(text, x, y)
      },

      textBox(text, boxDimensions, options) {
        // helpers.drawGuideBox(boxDimensions)

        // Line Height Formula: fontSize * lineHeight / ptsPerInch
        let oneLineHeight = doc.internal.getFontSize() * 1.2 / 72,
          finalX = boxDimensions.x,
          finalY = boxDimensions.y + oneLineHeight

        text = doc.splitTextToSize(text, boxDimensions.w)
        doc.text(text, finalX, finalY, options.align)
      },

      imageBox(imageName, boxDimensions, options) {
        // helpers.drawGuideBox(boxDimensions)
        options = _.defaults(options, {
          hAlign: "center",
          vAlign: "top"
        })
        let boxRatio = boxDimensions.w / boxDimensions.h

        return fetchImageByName(imageName).then((imageData) => {
          let imageRatio = imageData.width / imageData.height,
            finalX = boxDimensions.x,
            finalY = boxDimensions.y,
            finalW = boxDimensions.w,
            finalH = boxDimensions.h

          // TODO: Fill to Box

          // Fit to Box
          if(imageRatio > boxRatio) {
            // Squeeze Height
            finalH *= boxRatio/imageRatio

            // Manage Vertical Alignment
            if(options.vAlign == "middle") {
              finalY += (boxDimensions.h - finalH)/2
            } else if(options.vAlign == "bottom") {
              finalY += boxDimensions.h - finalH
            }

          } else {
            // Squeeze Width
            finalW *= imageRatio/boxRatio

            // Manage Horizontal Alignment
            if(options.hAlign == "center") {
              finalX += (boxDimensions.w - finalW)/2

            } else if(options.hAlign == "right") {
              finalX += (boxDimensions.w - finalW)
            }
          }

          doc.addImage(
            imageData,
            finalX,
            finalY,
            finalW,
            finalH
          )
        })
      }
    }

    helpers.p = helpers.findProperty

    return Promise.each(layers, layer => {
      // Draw a helper rectangle
      // TODO: draw based on dimensions.mode
      doc.setLineWidth(.005)
      doc.rect(
        layer.dimensions.x*.01*component.template.size.w,
        layer.dimensions.y*.01*component.template.size.h,
        layer.dimensions.w*.01*component.template.size.w,
        layer.dimensions.h*.01*component.template.size.h
      )

      // Always revert to defaults
      this.restoreDocumentDefaults(doc)

      // Early out if there's no lambda to eval
      if(!layer.renderFunction) { return }

      let actualFunction
      // Let the fires of hell erupt
      eval(`actualFunction = function(doc, helpers, dimensions, game, component, item) {
        ${layer.renderFunction}
      }`)

      return actualFunction(doc, helpers, layer.dimensions, game, component, item)
    })
  },

  renderBackgroundTemplates() {

  },

  renderPerPropertyTemplates() {

  },

  renderForegroundTemplates() {

  },
}

export default api

// Ideas for per-property templates
// propertyTemplate("title", (title, doc) => {
//   failUnless("text")
//
//   doc.setColor(color)
//   doc.setFont(font)
//   doc.renderText(title, x, y)
// })
//
// propertyTemplate("cost", (cost, doc) => {
//   failUnless("template")
//
//   doc.setColor(color)
//   doc.setFont(font)
//   doc.renderText(cost(), x, y)
// })
//
// propertyTemplate("image", (image, doc) => {
//   failUnless("image")
//
//   // implement stretch/crop to fit/fill
//
//   doc.addImage(image, x, y)
// })
