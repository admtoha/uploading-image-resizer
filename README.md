# uploading-image-resizer
Image upload resizing in the browser

This small project solves two common problems:

Users try to upload photos (or other images) and get a frustrating “file too large” error.
A site that accepts user images grows and begins to suffer degraded server performance or outages.
This tool automatically resizes and (if requested) re-encodes images in the user’s browser “on the fly” before they are sent to your server. It can also produce additional resized versions (e.g., large / medium / small) for responsive needs.

<h2> Live demo </h2>

Try the interactive demo to test behavior and tune options: https://admtoha.is-a.dev/html/demo_example_uploading_image_resizer.html

<h2> Supported formats </h2>

 - jpeg
 - png 
 - webp 
 - gif

<h2> Usage </h2>

Include the script on your page:
```html
<script language="JavaScript" src="./uploading_image_resizer.js"></script>
```
Add the data-uploading-image-resizer attribute to your file input and set options as a comma-separated list.
Example:
```html
<input type=file name=my_image data-uploading-image-resizer='max_height: 700, max_width: 900, type: jpg, quality: 0.85'>
```

<h2>Options (attribute form)</h2>

- type (String) — output image type: jpeg, png, webp, gif. If omitted, the original type is kept.
- max_height (Float) — maximum height in pixels (resize only if original height exceeds this).
- max_width (Float) — maximum width in pixels (resize only if original width exceeds this).
- quality (Float) — quality 0…1 (applies to jpeg and webp only). Default: 1.
- name (String) — output file name; extension may determine output type. If omitted, original name is preserved.
- height (Float) — exact output height in pixels.
- width (Float) — exact output width in pixels.
- callback (String) — name of a callback function invoked when processing finishes. Callback arguments:
- - node (HTMLInputElement) — the target input element
- - extra_ls (Array) — list of objects with input/output metadata:
  ```js
   {
    input: {
      file: file, // (File instance) - original image file
      name: fileName, // (String) - original image name
      type: fileType, // (String) - original image MIME type
      size: fileSize, // (Number) - original image size in bytes
      height: imageHeight, // (Number) - original image height in pixels
      width: imageWidth // (Number) - original image width in pixels
    },
    output: {
      file: file, // (File instance) - resized image file
      name: fileName, // (String) - resized image name
      type: fileType, // (String) - resized image MIME type
      size: fileSize, // (Number) - resized image size in bytes
      height: imageHeight, // (Number) - resized image height in pixels
      width: imageWidth // (Number) - resized image width in pixels
    }
  }
  ```
    Example:
    ```html
      <input type=file name=my_image data-uploading-image-resizer='max_height: 700, max_width: 900, type: jpg, callback: foo'>
          
      <script>
        function foo(node, extra_ls){
          console.log(JSON.stringifi(extra_ls));
        }
      </script>
    ```  
- target (String) — id of a file input that is treated as the “origin” for which this element will produce a resized version. Useful to generate multiple versions of the same image.
  Example (multiple outputs):
   ```html
  <input type=file id=origin_img name=origin_img>
  <input type=file name=medium_img style='display: none' data-uploading-image-resizer='target: origin_img, type: webp, max_height: 1080, max_width: 1920'>
  <input type=file name=small_img style='display: none' data-uploading-image-resizer='target: origin_img, type: webp, max_height: 500, max_width: 850'>
   ```
   You can also modify the original while creating other versions:
  ```html
  <input type=file id=origin_img name=big_img data-uploading-image-resizer='target: origin_img, type: webp, max_height: 2000, max_width: 4000'>
		<input type=file name=medium_img style='display: none' data-uploading-image-resizer='target: origin_img, type: webp, max_height: 1080, max_width: 1920'>
		<input type=file name=small_img style='display: none' data-uploading-image-resizer='target: origin_img, type: webp, max_height: 500, max_width: 850'>		
  ```
