/**
 * Created by zhangyi on 2017/11/7.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Picker from '../Picker'
import omit from 'omit.js'

export default class DatePicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pickerValue: this.getDefaultDate()
        }
    }

    static defaultProps = {
        mode: 'date',
        defaultValue: null,
        minDate: moment().add(-10, 'year').format('YYYY-MM-DD'),
        maxDate: moment().add(10, 'year').format('YYYY-MM-DD'),
    }

    static propTypes = {
        mode: PropTypes.string,
        value: PropTypes.string,
        minDate: PropTypes.string,
        maxDate: PropTypes.string
    }

    getDefaultDate () {
        let value = this.props.defaultValue
        if (value) {
            return value.split('-')
        }
        let { minDate, maxDate } = this.props
        minDate = moment(minDate)
        maxDate = moment(maxDate)

        const now = moment();
        let date = now
        if (minDate && now.isBefore(minDate)) {
            date = minDate;
        }
        if (maxDate && maxDate.isBefore(now)) {
            date = minDate;
        }
        date = date.format('YYYY-MM-DD').split('-')

        return date;
    }

    getYears = (minDate, maxDate) => {
        minDate = parseInt(minDate, 10)
        maxDate = parseInt(maxDate, 10)

        let years = []
        for(let i = minDate; i <= maxDate; i++) {
            years.push({
                label: i + '年',
                value: i
            })
        }
        return years;
    }

    getMonths = () => {
        let months = []
        for(let i = 1; i <= 12; i++) {
            months.push({
                label: i + '月',
                value: i
            })
        }
        return months;
    }

    getDays = (year, month) => {
        year = parseInt(year, 10)
        month = parseInt(month, 10)

        let dayNum = moment(new Date(`${year}-${month}-01`)).daysInMonth()
        let days = []
        for (let i = 1; i <= dayNum; i++) {
            days.push({
                label: i + '日',
                value: i
            })
        }
        return days;
    }

    getOptions = () => {
        const { mode, minDate, maxDate} = this.props
        let value = this.state.pickerValue
        let options = []
        if (mode === 'date') {
            let year = (value && value[0]) || moment().year()
            let month = (value && value[1]) || 1
            options = [this.getYears(minDate, maxDate), this.getMonths(), this.getDays(year, month)]
        }
        return options
    }

    formatValue = (value) => {
        switch (this.props.mode) {
            case 'date':
                return value.join('-')
        }
    }

    render () {
        const { onChange, onOk } = this.props
        const restProps = omit(this.props, [
            'value', 'onChange', 'onOk'
        ])
        const options = this.getOptions()

        return (
            <Picker
                options={options}
                value={this.state.pickerValue}
                onChange={(value) => {
                    this.setState({
                        pickerValue: value
                    })
                    value = this.formatValue(value)
                    onChange && onChange(value)
                }}
                onOk={(value) => {
                    this.setState({
                        pickerValue: value
                    })
                    value = this.formatValue(value)
                    onOk && onOk(value)
                }}
                {...restProps}

            />
        )
    }
}