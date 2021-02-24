import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import RippleNumber from '.'

describe('RippleNumber', () => {
  test('Snapshot Test', () => {
    const props = {
      number: {
        open: false,
        value: '0',
      },
    }

    const component = renderer.create(<RippleNumber {...props} />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('ラベルテキストが正しく表示されているか確認', () => {
    const props = {
      number: {
        open: false,
        value: '0',
      },
    }

    // propsを受け取り mount テスト対象component生成
    const wrapper = mount(<RippleNumber {...props} />)

    // { value }にpropsで受け取った値が表示されているか確認
    expect(wrapper.find('div').text()).toBe(props.number.value)
  })
})
