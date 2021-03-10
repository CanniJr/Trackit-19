import React from 'react'
import './CSS/DataBox.css'
import { Card, CardContent, Typography } from '@material-ui/core'

function DataBox({ title, cases, total, ...props}) {
    return (
        <Card onClick={props.onClick} className='dataBox'>
            <CardContent>
                <Typography className='dataBox__title' color='textSecondary'>{title}</Typography>  
                <h2 className='dataBox__cases'>{cases}</h2>
                <Typography className='dataBox__total' color='textSecondary'>{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default DataBox
