import Vue from "vue"
import _ from "lodash"

const mixins = {
  addLeadingZero (num) {
    return (num < 10 ? `0${num}` : num)
  },
  capitalize (value) {
    if (!value) return ""
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  },
  checkError (fieldName, validationProps, vuelidateObj, displayName) {
    const errors = []
    if (typeof vuelidateObj === "undefined" || typeof fieldName === "undefined") return errors
    if (typeof vuelidateObj[fieldName] === "undefined") return errors
    if (!vuelidateObj[fieldName].$dirty) return errors
    if (typeof displayName === "undefined") {
      displayName = fieldName
    }
    const errMessages = {
      checked: `${this.capitalize(displayName)} is required`,
      required: `${this.capitalize(displayName)} is required`,
      sameAsPassword: `${this.capitalize(displayName)} does not match.`,
      // regex: `${this.validationLabel} ${this.regexErrorMsg ? this.regexErrorMsg: ''}`,
      maxLength: `${this.capitalize(displayName)} must have at most ${vuelidateObj[fieldName].$params.maxLength ? vuelidateObj[fieldName].$params.maxLength.max : ""} characters`,
      minLength: `${this.capitalize(displayName)} must have at least ${vuelidateObj[fieldName].$params.minLength ? vuelidateObj[fieldName].$params.minLength.min : ""} characters`,
      minValue: `${this.capitalize(displayName)} must be at least ${vuelidateObj[fieldName].$params.minValue ? vuelidateObj[fieldName].$params.minValue.min : ""}`,
      maxValue: `${this.capitalize(displayName)} must be at most ${vuelidateObj[fieldName].$params.maxValue ? vuelidateObj[fieldName].$params.maxValue.max : ""}`,
      email: `${this.capitalize(displayName)} is invalid`,
      uniqueEmail: `Email already exist`
    }

    _.each(validationProps[fieldName], (value, key) => {
      if (!vuelidateObj[fieldName][key]) {
        if (typeof value !== "function") {
          errors.push(value)
        }
        else {
          errors.push(errMessages[key])
        }
      }
    })

    return errors
  },
  determineFileType (file) {
    let type = ""
    let fileType
    if (!file) return type
    if (file instanceof File) {
      fileType = file.type
    }
    else if (file instanceof String) {
      fileType = file
    }
    else {
      console.warn("File Type cannot be determine, must be type of String or File.")
      return type
    }

    if (fileType.indexOf("image") !== -1) {
      type = "image"
    }
    else if (fileType.indexOf("video") !== -1) {
      type = "video"
    }
    else {
      type = "raw"
    }
    return type
  },
  // getArrayOfAPIDataAndCount (app, store, route, filter) {

  // },
  getLocaleLangCode (localeValue) {
    const LOCALE_LANG = {
      en: "English",
      zh: "中文"
    }
    if (!localeValue) {
      return console.warn("Unable to get locale code. Locale value is required.")
    }
    return LOCALE_LANG[localeValue] || "us"
  },
  getSchemaObjAndSetDefaultEmptyObj (collection) {
    const schemaObj = collection.simpleSchema().schema()
    const defaultObj = {}
    Object.keys(schemaObj).forEach((key) => {
      defaultObj[key] = ""
    })
    return defaultObj
  },
  isNumeric (n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  },
  removeEmptyObjectVariable (obj) {
    Object.keys(obj).forEach(key => {
      if (!obj[key]) {
        delete obj[key]
      }
    })
  },
  resolveImgAssets () {
    return require("~/assets/img/profile-bg.jpg")
  },
  setMetaSEOHead (title, description, ogTitle, ogDescription, ogType, ogImage) {
    return {
      title: title || "96Travel",
      meta: [
        {
          hid: "description",
          name: "description",
          content: description || "Affordable and cheap hotels booking, up to 80% off ! Come Travel provides you with the BEST PRICE and BOOST your whole travel experience."
        },
        {
          name: "og:title",
          content: ogTitle || "96Travel"
        },
        {
          name: "og:description",
          content: ogDescription || "Affordable and cheap hotels booking, up to 80% off ! Come Travel provides you with the BEST PRICE and BOOST your whole travel experience."
        },
        {
          name: "og:url",
          content: this.baseUrl
        },
        {
          name: "og:type",
          content: ogType || "website"
        },
        {
          name: "og:image",
          content: ogImage || "https://res.cloudinary.com/travel96/image/upload/ztmtigtqenwxhh1imu4i"
        }
      ]
    }
  },
  uploadFile (file, callback) {
    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/upload`
    const xhr = new XMLHttpRequest()
    const fd = new FormData()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")

    // Reset the upload progress bar
    //  document.getElementById('progress').style.width = 0;

    // // Update progress (can be used to show progress indicator)
    // xhr.upload.addEventListener("progress", function(e) {
    //   var progress = Math.round((e.loaded * 100.0) / e.total);
    //   document.getElementById('progress').style.width = progress + "%";

    //   console.log(`fileuploadprogress data.loaded: ${e.loaded},
    // data.total: ${e.total}`);
    // });

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // File uploaded successfully
        const response = JSON.parse(xhr.responseText)
        // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
        const url = response.secure_url
        // Create a thumbnail of the uploaded image, with 150px width
        const tokens = url.split("/")
        tokens.splice(-2, 0, "w_150,c_scale")
        // console.log(response.public_id, url);
        callback(response.public_id)
        // var img = new Image(); // HTML5 Constructor
        // img.src = tokens.join('/');
        // img.alt = response.public_id;
        // document.getElementById('gallery').appendChild(img);
      }
    }

    fd.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET)
    fd.append("tags", "browser_upload") // Optional - add tag for image admin in Cloudinary
    fd.append("file", file)
    xhr.send(fd)
  }
}

const commonFunction = {
  install (Vue, options) {
    Vue.prototype.$helpers = { ...mixins }
  }
}

Vue.use(commonFunction)
// Vue.mixin(mixins)
export default (context, inject) => {
  inject("helpers", mixins)
}
