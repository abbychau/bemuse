
import './ResultDeltasView.scss'
import React    from 'react'
import _        from 'lodash'
import variance from 'variance'
import mean     from 'mean'
import median   from 'median'

import Panel        from 'bemuse/ui/Panel'
import { timegate } from 'bemuse/game/judgments'

const ms = delta => `${(delta * 1000).toFixed(1)} ms`

const group = deltas => (_(deltas)
  .map(delta => Math.floor(delta * 100))
  .countBy(bucket => bucket)
  .value()
)

export default React.createClass({
  render () {
    const deltas = this.props.deltas
    const nonMissDeltas = deltas.filter(delta => Math.abs(delta) < timegate(4))
    const offDeltas = deltas.filter(delta => timegate(1) <= Math.abs(delta))
    const earlyCount = offDeltas.filter(delta => delta < 0).length
    const lateCount = offDeltas.filter(delta => delta > 0).length
    const groups = group(deltas)
    const stats = _.range(-20, 20).map(bucket => ({
      bucket,
      count: groups[bucket] || 0,
    }))
    const max = _(stats).map('count').max()
    const height = value => Math.ceil(value / Math.max(max, 1) * 128)
    return (
      <div className="ResultDeltasView">
        <Panel title="Accuracy Data">
          <div className="ResultDeltasViewのcontent">
            <div className="ResultDeltasViewのhistogram">
              {stats.map(({ bucket, count }) =>
                <div
                  className="ResultDeltasViewのhistogramBar"
                  data-bucket={bucket}
                  style={{ height: height(count) }}
                >
                </div>
              )}
            </div>
            <div className="ResultDeltasViewのnumber is-early">
              <strong>{earlyCount}</strong> EARLY
            </div>
            <div className="ResultDeltasViewのnumber is-late">
              <strong>{lateCount}</strong> LATE
            </div>
            <table className="ResultDeltasViewのinfo">
              <tbody>
                {this.renderRow('Mean:', mean(nonMissDeltas))}
                {this.renderRow('S.D:', Math.sqrt(variance(nonMissDeltas)), { showEarlyLate: false })}
                {this.renderRow('Median:', median(nonMissDeltas))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    )
  },
  renderRow (text, data, options = { }) {
    return (
      <tr>
        <th>{text}</th>
        <td className="is-number">{ms(data)}</td>
        <td>{options.showEarlyLate !== false
          ? (data > 0 ? '(late)' : data < 0 ? '(early)' : '')
          : null
        }</td>
      </tr>
    )
  },
})
