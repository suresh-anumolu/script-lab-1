import React, { Component } from 'react'
import { BackstageWrapper, NavMenu, NavMenuItem, ContentWrapper } from './styles'
import FabricIcon from '../FabricIcon'

import MySolutions from './MySolutions'
import Samples from './Samples'
import ImportSolution from './ImportSolution'
import { ISolution } from '../../stores/solutions'

// TODO: refactor to using Fabric Pivot, but due to styling issues, can't currently do that.

interface IBackstageItem {
  key: string
  icon: JSX.Element
  label?: string
  onSelect?: () => void
  content?: JSX.Element
}

interface IBackstage {
  hideBackstage: () => void
  isHidden: boolean

  // from redux
  solutions: ISolution[]
  activeSolution?: ISolution
  createNewSolution: () => void
  openSolution: (solutionId: string) => void
  importGist: (gistUrl: string) => void
}

interface IState {
  selectedKey: string
}
const ICON_SIZE = '2rem'

// TODO: figure out how this data will be fetched and piped through
export default class Backstage extends Component<IBackstage, IState> {
  state = {
    selectedKey: 'my-solutions',
  }

  constructor(props) {
    super(props)
  }

  render() {
    const items = [
      {
        key: 'back',
        icon: <FabricIcon name="GlobalNavButton" size={ICON_SIZE} />,
        onSelect: this.props.hideBackstage,
      },
      {
        key: 'new',
        icon: <FabricIcon name="Add" size={ICON_SIZE} />,
        label: 'New Snippet',
        onSelect: () => {
          this.props.createNewSolution()
          this.props.hideBackstage()
        },
      },
      {
        key: 'my-solutions',
        icon: <FabricIcon name="DocumentSet" size={ICON_SIZE} />,
        label: 'My Snippets',
        content: (
          <MySolutions
            solutions={this.props.solutions}
            openSolution={this.props.openSolution}
            activeSolution={this.props.activeSolution}
          />
        ),
      },
      {
        key: 'samples',
        icon: <FabricIcon name="Dictionary" size={ICON_SIZE} />,
        label: 'Samples',
        content: <Samples />,
      },
      {
        key: 'import',
        icon: <FabricIcon name="Download" size={ICON_SIZE} />,
        label: 'Import',
        content: <ImportSolution importGist={this.props.importGist} />,
      },
    ].map((item: IBackstageItem) => ({
      onSelect: () => this.setState({ selectedKey: item.key }),
      ...item,
    }))
    const { selectedKey } = this.state
    const activeItem = items.find(item => item.key === selectedKey)
    return (
      <BackstageWrapper style={{ display: this.props.isHidden ? 'none' : 'flex' }}>
        <NavMenu>
          {items.map(item => (
            <NavMenuItem
              key={item.key}
              onSelect={item.onSelect}
              isSelected={selectedKey === item.key}
            >
              {item.icon}
              {item.label && <span>{item.label}</span>}
            </NavMenuItem>
          ))}
        </NavMenu>
        {activeItem && activeItem.content}
      </BackstageWrapper>
    )
  }
}
