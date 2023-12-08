// Requires Jquery !

const make_image_lowq = (img_uri, handle, error) => {
  $.ajax({
    url: `http://api.resmush.it/ws.php?img=${img_uri}?.jpg&qlty=70`,
    success: x => handle(x),
    error: () => error()
  })
}

// Get image url
// ai : boolean [ Ai generated image or not ]
// handleOutput : the function to handle the uri
const get_image_uri = (ai, handleOutput) => {
  
  const rnd = Math.floor(Math.random() * 65212)

  // retry on error
  const error = () => {
    get_image_uri(ai, handleOutput)
  }
  
  const handle = (uri) => {
    console.log(uri)
    make_image_lowq(uri, sd => {
      console.log(sd)
      const err = sd['error'] ?? 0
      err ? error() : handleOutput(uri, sd['dest'])
    }, error)
  }

  if ( ai ) return handle('https://thispersondoesnotexist.com/?rnd='+rnd)
  $.ajax({
    url: 'https://thispersonexists.net/data/' + rnd + '.json',
    success: x => handle(x['photo_url']),
    error: error
  })
}