import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const barrios = [
  { 'name': 'Carapachay', 'value': 'carapachay' },
  { 'name': 'Florida Este', 'value': 'florida-este' },
  { 'name': 'Florida Oeste', 'value': 'florida-oeste' },
  { 'name': 'La Lucila', 'value': 'la-lucila' },
  { 'name': 'Munro', 'value': 'munro' },
  { 'name': 'Olivos', 'value': 'olivos' },
  { 'name': 'Vicente López', 'value': 'vicente-lopez' },
  { 'name': 'Villa Adelina', 'value': 'villa-adelina' },
  { 'name': 'Villa Martelli', 'value': 'villa-martelli' }
]

const states = [
  { 'name': 'No ganador', 'value': 'no-ganador' },
  { 'name': 'En preparación', 'value': 'preparacion' },
  { 'name': 'En proceso de compra', 'value': 'compra' },
  { 'name': 'En ejecución', 'value': 'ejecucion' },
  { 'name': 'Finalizado', 'value': 'finalizado' }
]

const anios = ['2018', '2019','2020']

export default class Filter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeDropdown: null,
      defaultFilters: ['anio', 'state']
    }
  }

  componentWillMount () {
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClick, false)
  }

  handleDropdown = (id) => (e) => {
    // Show or hide the options div
    e.preventDefault()
    this.setState({
      activeDropdown: this.state.activeDropdown === id ? null : id
    })
  }

  // Send filter to parent component
  handleFilter = (filter) => (e) => {
    const value = e.target.value
    const isDefault = [...this.state.defaultFilters].includes(filter)
    if (isDefault) {
      this.setState({
        defaultFilters: [...this.state.defaultFilters].filter((it) => it !== filter)
      }, this.props.handleDefaultFilter(filter, value))
    } else if (this.props[filter].length === 1 && this.props[filter].includes(value) && filter !== 'barrio') {
      this.setState({
        defaultFilters: [...this.state.defaultFilters, filter]
      }, this.props.handleFilter(filter, value))
    } else {
      this.setState({
        defaultFilters: [...this.state.defaultFilters].filter((it) => it !== filter)
      }, this.props.handleFilter(filter, value))
    }
  }

  // Close dropdown if clicked outside
  handleClick = (e) => {
    if ((!ReactDOM.findDOMNode(this).contains(e.target) || e.target.id === 'filter') && this.state.activeDropdown !== null) {
      this.setState({
        activeDropdown: null
      })
    }
  }

  // Clear all selected items from a filter
  clearFilter = (filter) => (e) => {
    this.props.clearFilter(filter)
    if (filter !== 'barrio') {
      this.setState({
        defaultFilters: [...this.state.defaultFilters, filter]
      })
    }
  }

  render () {
    return (
      <nav id='filter'>
        {this.props.openVotation &&
          <div className='stage-container'>
            <a className='stage-changer' onClick={this.props.changeStage}>
              {/* se oculta filtro de proyectos ganadores del año pasado hasta agosto. */}
              {this.props.stage === 'seguimiento' ? 'Ver factibles >' : '< Ver seguimiento de proyectos'}
            
            </a>
          </div>
        }
        <div className={`filters-nav ${this.props.stage === 'votacion' ? 'center' : ''}`}>
          <div className='button-container'>
            <button className='dropdown-button' onClick={this.handleDropdown('barrio')}>
              <div>
                <span className={`button-label ${this.props.barrio.length > 0 ? 'active' : ''}`}>Barrio</span>
                {this.props.barrio.length > 0 &&
                  <span className='badge'>{this.props.barrio.length}</span>
                }
              </div>
              <span className='caret-down'>▾</span>
            </button>
            {this.state.activeDropdown === 'barrio' &&
              <div className='dropdown-options'>
                <div className='options-container'>
                  {barrios.map((b, i) => (
                    <label className='option-label' key={i}>
                      <input
                        type='checkbox'
                        value={b.value}
                        onChange={this.handleFilter('barrio')}
                        checked={this.props.barrio.includes(b.value)} />
                      <span className='checkbox-label'>{b.name}</span>
                    </label>
                  ))}
                </div>
                <button className='clear-filters' onClick={this.clearFilter('barrio')}>
                  <span>Borrar filtros</span>
                </button>
              </div>
            }
          </div>
          {this.props.stage === 'seguimiento' &&
          <div className='button-container'>
            <button className='dropdown-button' onClick={this.handleDropdown('state')}>
              <div>
                <span className={`button-label ${(this.props.state.length > 0 && !this.state.defaultFilters.includes('state')) ? 'active' : ''}`}>Estado</span>
                {this.props.state.length > 0 && !this.state.defaultFilters.includes('state') &&
                  <span className='badge'>{this.props.state.length}</span>
                }
              </div>
              <span className='caret-down'>▾</span>
            </button>
            {this.state.activeDropdown === 'state' &&
              <div className='dropdown-options'>
                <div className='options-container'>
                  {states.map((s, i) => (
                    <label className='option-label' key={i}>
                      <input
                        type='checkbox'
                        value={s.value}
                        onChange={this.handleFilter('state')}
                        checked={![...this.state.defaultFilters].includes('state') && this.props.state.includes(s.value)} />
                      <span className='checkbox-label'>{s.name}</span>
                    </label>
                  ))}
                </div>
                <button className='clear-filters' onClick={this.clearFilter('state')}>
                  <span>Borrar filtros</span>
                </button>
              </div>
            }
          </div>
          }
          {this.props.stage === 'seguimiento' &&
            <div className='button-container'>
              <button className='dropdown-button' onClick={this.handleDropdown('anio')}>
                <div>
                  <span className={`button-label ${(this.props.anio.length > 0 && !this.state.defaultFilters.includes('anio')) ? 'active' : ''}`}>Año</span>
                  {this.props.anio.length > 0 && !this.state.defaultFilters.includes('anio') &&
                    <span className='badge'>{this.props.anio.length}</span>
                  }
                </div>
                <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown === 'anio' &&
              <div className='dropdown-options'>
                <div className='options-container'>
                  {anios.map((a, i) => (
                    <label className='option-label' key={i}>
                      <input
                        type='checkbox'
                        value={a}
                        onChange={this.handleFilter('anio')}
                        checked={![...this.state.defaultFilters].includes('anio') && this.props.anio.includes(a)} />
                      <span className='checkbox-label'>{a}</span>
                    </label>
                  ))}
                </div>
                <button className='clear-filters' onClick={this.clearFilter('anio')}>
                  <span>Borrar filtros</span>
                </button>
              </div>
              }
            </div>
          }
        </div>
      </nav>
    )
  }
}
