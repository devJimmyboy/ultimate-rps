import { NextPage } from "next"
import Head from "next/head"
import { ReactElement } from "react"
type Props = {
  title?: string
  description?: string
  image?: string
}

export const AppHead = ({
  title = "Ultimate Rock Paper Scissors",
  description = "1v1 me right now in Rock Paper Scissors. I'll beat you in *seconds*",
  image = "/meta.png",
}: Props): ReactElement => (
  <Head>
    <meta charSet="UTF-8" />
    <link rel="icon" type="image/gif" href="https://cdn.betterttv.net/emote/5c3427a55752683d16e409d1/2x" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta name="site_name" content="Ultimate Rock Paper Scissors" />
    <meta name="application-name" content="Ultimate Rock Paper Scissors" />

    <title>Ultimate RPS</title>
    <meta property="og:title" content={title} />
    <meta name="twitter:title" content="Ultimate Rock Paper Scissors" />

    <meta name="keywords" content="Rock Paper Scissors,RPS," />

    <meta name="theme-color" content="#3e7ee7" />

    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />

    <meta property="image" content={image} />
    <meta property="og:image" content={image} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:image:src" content={image} />
    <meta name="twitter:image:alt" content="Meta image for Ultimate RPS @ rps.io" />

    <meta name="twitter:card" content="summary_large_image" />

    <meta name="twitter:creator" content="@devJimmyboy" />
  </Head>
)
