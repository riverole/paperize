<template lang="pug">
v-card.image-library
  v-card-title
    .headline Image Library

  v-card-text
    .subheading Folders
    p Currently, all image files must be stored in Google Drive folders that you manage here. When you create Game Components, you have the option to have Paperize create and track an image folder for that Component automatically. Otherwise, you can paste a link to a Drive Folder below.

    v-list(subtitle)
      v-list-tile(v-for="folder in imageFolders" :key="folder.id")
        v-list-tile-title {{ folder.name }} ({{ (folder.index || []).length }} images)
        v-list-tile-action
          v-btn(small flat icon @click="refreshImageFileIndex(folder.id)")
            v-icon refresh
        v-list-tile-action
          v-btn(small flat icon @click="confirmDeleteImageFolder(folder)")
            v-icon delete

      v-list-tile(v-if="!imageFolders.length")
        v-list-tile-title No image folders have been added.

    .subheading Paste Link
    v-layout
      v-flex(xs12 sm8)
        v-text-field(v-model="pastedLink")
      v-flex(xs12 sm4)
        v-btn(@click="addImageFolderViaLink(pastedLink)") Import Folder
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {

    data() {
      return {
        pastedLink: ""
      }
    },

    computed: {
      ...mapGetters(["imageFolders"])
    },

    methods: {
      ...mapActions(["addImageFolderViaLink", "refreshImageFileIndex", "deleteImageFolder"]),

      confirmDeleteImageFolder(imageFolder) {
        if(confirm(`Are you sure you want to stop tracking the image folder '${imageFolder.name}'?`)) {
          this.deleteImageFolder(imageFolder.id)
        }
      }
    }
  }
</script>
