import test from 'tape'
import React from 'react'
import jQuery from 'jquery'
import { render } from 'react-dom'

test('should have a proper testing environment', assert => {
  jQuery('body').append('<input>')
  const $searchInput = jQuery('input')

  assert.true($searchInput instanceof jQuery, '$searchInput is an instanceof jQuery')

  assert.end()
})