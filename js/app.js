/* global jQuery */

jQuery(function ($) {
  'use strict'

  const App = {

    tileTypes: ['tile-a', 'tile-b', 'tile-c', 'tile-d', 'tile-e'],
    boardWidth: 20,
    boardHeight: 10,
    points: 0,
    total: 0,

    init: function () {
      this.updateBoardSizes()
      this.renderTiles()
      this.attachThemeHandlers()
    },

    updateBoardSizes: function () {
      $('#board').width(this.boardWidth * 40).height(this.boardHeight * 40)
      $('.container').width(this.boardWidth * 40)
    },

    renderTiles: function () {
      for (let i = 0; i < this.boardWidth * this.boardHeight; i++) {
        const pTop = Math.floor(i / this.boardWidth) * 40
        const pLeft = (i % this.boardWidth) * 40
        const tileType = this.tileTypes[Math.floor(Math.random() * this.tileTypes.length)]
        $('<div class="tile"></div>').attr('id', i).css('top', pTop).css('left', pLeft).addClass(tileType).data('tile-type', tileType).prependTo('#board').click(this.handleTileClick.bind(this))
      }
    },

    attachThemeHandlers: function () {
      $('.change-theme').on('click', this.handleThemeChange.bind(this))
    },

    handleThemeChange: function (event) {
      const theme = $(event.target).data('theme')
      $('#game-container').removeClass().addClass(theme)
      return false
    },

    handleTileClick: function (event) {
      const id = event.target.id
      if (this.isTileMarked(id)) {
        this.deleteMarked()
        this.compactColumnsDown()
        this.compactColumnsLeft()
        this.updateTotal(this.points)
      } else {
        $('.mark').removeClass('mark')
        let numMarked = this.checkNeighbors(id)
        this.points = (numMarked - 1) * (numMarked - 1) // formula (n-1)^2
        $('#points').html('' + this.points)
        if (numMarked > 0) {
          this.markTile(id)
        } else {
          this.updatePoints(0)
        }
      }
    },

    updatePoints: function (n) {
      this.points = n
      $('#points').html(n)
    },

    updateTotal: function () {
      this.total += this.points
      $('#total').html('' + this.total)
      this.updatePoints(0)
    },

    compactColumnsLeft: function () {
      let keepGoing = false
      for (let col = 0; col < this.boardWidth - 1; col++) {
        const missingTiles = []
        for (let row = 0; row < this.boardHeight; row++) {
          const id = col + (this.boardWidth * row)
          if (this.tileExists(id)) {
            break
          } else {
            missingTiles.push(id)
            if (missingTiles.length === this.boardHeight) {
              while (missingTiles.length > 0) {
                const missingTileId = missingTiles.pop()
                const rightNeighborId = missingTileId + 1
                if (this.tileExists(rightNeighborId)) {
                  keepGoing = true
                  $('#' + rightNeighborId).attr('id', missingTileId).animate({left: '-=40'}, 10)
                }
              }
            }
          }
        }
      }
      if (keepGoing) {
        this.compactColumnsLeft()
      }
    },

    compactColumnsDown: function () {
      let keepGoing = false
      for (let id = this.boardWidth * this.boardHeight - 1; id > -1; id--) {
        if (!this.tileExists(id)) {
          const topNeighborId = id - this.boardWidth
          if (this.tileExists(topNeighborId)) {
            $('#' + topNeighborId).attr('id', id).animate({top: '+=40'}, 10)
            keepGoing = true
          }
        }
      }
      if (keepGoing) {
        this.compactColumnsDown()
      }
    },

    deleteMarked: function () {
      $('.mark').remove()
    },

    markTile: function (id) {
      $('#' + id).addClass('mark')
    },

    tileExists: function (id) {
      return $('#' + id).length === 1
    },

    isTileMarked: function (id) {
      return $('#' + id).hasClass('mark')
    },

    isTileSameType: function (myId, neighborId) {
      return $('#' + myId).data('tile-type') === $('#' + neighborId).data('tile-type')
    },

    checkNeighbors: function (id) {
      let c = 0
      const numId = parseInt(id, 10)
      const top = numId - this.boardWidth
      const right = numId + 1
      const bottom = numId + this.boardWidth
      const left = numId - 1
      if (top > -1 && this.isTileSameType(id, top) && !this.isTileMarked(top)) {
        c++
        this.markTile(top)
        c += this.checkNeighbors(top)
      }
      if (right % this.boardWidth !== 0 && this.isTileSameType(id, right) && !this.isTileMarked(right)) {
        c++
        this.markTile(right)
        c += this.checkNeighbors(right)
      }
      if (bottom < this.boardWidth * this.boardHeight && this.isTileSameType(id, bottom) && !this.isTileMarked(bottom)) {
        c++
        this.markTile(bottom)
        c += this.checkNeighbors(bottom)
      }
      if ((left + 1) % this.boardWidth !== 0 && this.isTileSameType(id, left) && !this.isTileMarked(left)) {
        c++
        this.markTile(left)
        c += this.checkNeighbors(left)
      }
      return c
    }

  }

  App.init()
})
