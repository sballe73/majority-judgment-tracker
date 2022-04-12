import Link from 'next/link'
import React, { Component } from 'react'
import dynamic from 'next/dynamic'
const DynamicPlot = dynamic(import('react-plotly.js'), {
  ssr: false
})

export const getStaticProps = async ({locale}) => {
  const matter = require('gray-matter')
  const {join, parse} = require('path')
  const {readFileSync} = require('fs')
  const glob = require('glob')

  const graphDir = join(process.cwd(), 'public/graphs/')
  const graphs = {}
  glob.sync(join(graphDir, '*_elb.json')).forEach((file) => {
    const key = parse(file).name;
    const [start, end, who] = key.split('_')
    const fileContents = readFileSync(file, 'utf8')
    graphs[`${who.toUpperCase()} - ${start}`] = JSON.parse(fileContents)
  })
  return {
    props: {
      graphs,
    },
  };
};

class elabe extends Component {
  constructor(props) {
    super()
    this.plots = []
    const keys=Object.keys(props.graphs)
    keys.forEach(element => {
      const {data, layout} = props.graphs[element]
      this.plots.push(
      <li key={element}>{element} :
          <DynamicPlot data={data} layout={layout}
          config={{responsive: true}}
          useResizeHandler={false}
          style={{width: "100%", height: "400px"}}
        />
      </li>
      )
    });
  }

  render () {
    return (
      <div>
        <h1>
          <Link href="/">
            <a>Retour</a>
          </Link>
        </h1>
        <ol>
          {this.plots}
        </ol>
    </div>
    )
  }
}

export default elabe;