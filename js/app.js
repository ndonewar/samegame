/* global jQuery */

jQuery(function ($) {
  'use strict'

  const App = {

    tileTypes: ['tile-a', 'tile-b', 'tile-c', 'tile-d', 'tile-e'],
    boardWidth: 25,
    boardHeight: 15,
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
      const el = event.target
      if (this.isMarked(el)) {
        this.deleteMarked()
        this.settleDown()
        this.settleLeft()
        this.updateTotal(this.points)
      } else {
        $('.mark').removeClass('mark')
        let n = this.checkTRBL(el)
        this.points = (n - 1) * (n - 1)
        $('#points').html('' + this.points)
        if (n) {
          this.mark(el)
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

    settleLeft: function () {
      let again = false
      for (let h = 0; h < this.boardWidth - 1; h++) {
        const col = []
        for (let v = 0; v < this.boardHeight; v++) {
          const id = h + (this.boardWidth * v)
          if (document.getElementById(id.toString())) {
            break
          } else {
            col.push(id)
            if (col.length === this.boardHeight) {
              while (col.length > 0) {
                const oid = col.pop()
                if (document.getElementById(oid + 1)) {
                  again = true
                  $('#' + (oid + 1)).attr('id', oid).animate({left: '-=40'}, 10)
                }
              }
            }
          }
        }
      }
      if (again) this.settleLeft()
    },

    settleDown: function () {
      let again = false
      for (let i = this.boardWidth * this.boardHeight - 1; i > -1; i--) {
        if (!document.getElementById(i.toString())) {
          if (document.getElementById((i - this.boardWidth).toString())) {
            $('#' + (i - this.boardWidth)).attr('id', i).animate({top: '+=40'}, 10)
            again = true
          }
        }
      }
      if (again) this.settleDown()
    },

    deleteMarked: function () {
      $('.mark').remove()
    },

    mark: function (el) {
      $(el).addClass('mark')
    },

    checkTRBL: function (el) {
      let c = 0
      const t = parseInt(el.id) - this.boardWidth
      const r = parseInt(el.id) + 1
      const b = parseInt(el.id) + this.boardWidth
      const l = parseInt(el.id) - 1
      if (t > -1 && this.same(el, t) && !this.isMarked(document.getElementById(t.toString()))) {
        c++
        this.mark(document.getElementById(t.toString()))
        c += this.checkTRBL(document.getElementById(t.toString()))
      }
      if (r % this.boardWidth !== 0 && this.same(el, r) && !this.isMarked(document.getElementById(r.toString()))) {
        c++
        this.mark(document.getElementById(r.toString()))
        c += this.checkTRBL(document.getElementById(r.toString()))
      }
      if (b < this.boardWidth * this.boardHeight && this.same(el, b) && !this.isMarked(document.getElementById(b.toString()))) {
        c++
        this.mark(document.getElementById(b.toString()))
        c += this.checkTRBL(document.getElementById(b.toString()))
      }
      if ((l + 1) % this.boardWidth !== 0 && this.same(el, l) && !this.isMarked(document.getElementById(l.toString()))) {
        c++
        this.mark(document.getElementById(l.toString()))
        c += this.checkTRBL(document.getElementById(l.toString()))
      }
      return c
    },

    same: function (el, nb) {
      return $(el).data('tile-type') === $('#' + nb).data('tile-type')
    },

    isMarked: function (el) {
      return $(el).hasClass('mark')
    }
  }

  App.init()
})
