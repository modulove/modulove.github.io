# MOD1 Content Update Instructions

I've created the `mod1_firmware.html` shortcode that displays module images with lightbox functionality.

## How to Update Each Firmware Section

### Images Available:
- 3LFO
- LFO
- ADSR
- SyncLFO
- ENV (for the EG firmware)
- EUCLID
- RND_SEQ (for Random CV Sequencer)

### Old Format Example:
```markdown
<div class="firmware-section">

## 3-Channel LFO

<div class="firmware-header">
  <div class="firmware-image">〰️</div>
  <div class="firmware-description">
    <h4>Features</h4>
    <ul>
      <li>3 independent LFO outputs</li>
      <li>...</li>
    </ul>
  </div>
</div>

**Perfect for:** ...

**Controls:**
...

{{< firmware_button hex="MOD1_3LFO" buttonText="Flash 3-Channel LFO" >}}

</div>
```

### New Format:
```markdown
{{< mod1_firmware title="3-Channel LFO" hex="MOD1_3LFO" buttonText="Flash 3-Channel LFO" image="3LFO" >}}
<ul>
  <li>3 independent LFO outputs</li>
  <li>...</li>
</ul>

**Perfect for:** ...

**Controls:**
...
{{< /mod1_firmware >}}
```

## Key Changes:
1. Replace `<div class="firmware-section">` with shortcode opening `{{< mod1_firmware ... >}}`
2. Remove the `<div class="firmware-header">` and nested divs
3. Remove the emoji `<div class="firmware-image">`
4. Remove the `<h4>Features</h4>` header (shortcode adds it automatically)
5. Keep the `<ul>` list with features
6. Keep the "Perfect for" and "Controls" sections
7. Remove the `{{< firmware_button ... >}}` (shortcode includes it)
8. Remove closing `</div>` tags and add `{{< /mod1_firmware >}}`

## Image Slug Mappings:
- **3-Channel LFO** → `image="3LFO"`
- **Single LFO** → `image="LFO"`
- **ADSR** → `image="ADSR"`
- **Sync LFO** → `image="SyncLFO"`
- **EG (AR Envelope)** → `image="ENV"`
- **Euclidean** → `image="EUCLID"`
- **Random CV Sequencer** → `image="RND_SEQ"`

## Firmware Without Images:
For firmware that don't have images available yet, just omit the `image` parameter:

```markdown
{{< mod1_firmware title="Clock Div/Multi" hex="MOD1_clock_div_multi" buttonText="Flash Clock Div/Multi" >}}
...
{{< /mod1_firmware >}}
```

The shortcode will work fine without an image - it just won't display the image column.

## Features:
- **Thumbnail Display**: Shows 300px-wide thumbnail of module design
- **Hover Effect**: Module image scales slightly and shows "Click to enlarge" overlay
- **Click to Enlarge**: Opens full-resolution image in lightbox overlay
- **Responsive**: On mobile, image stacks above content
- **Pink Panther Theme**: Images have pink accent borders that change to orange/teal on hover
