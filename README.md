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
  ```javascript
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

<h2> Notes </h2>

- All options are optional.
- To preserve aspect ratio, specify only one exact dimension (height or width), or use max_height and/or max_width.
- Multiple file selection is supported — each file is processed according to options.
- Processing takes time. If your app uploads immediately on file selection, the upload may start before resizing finishes and the original files could be sent. Use the callback option and start uploads only after the callback fires to ensure processing is complete.

<h2> Programmatic API </h2>

You can call the resizer directly:
```javascript
resize_image_file(image_file, options)
```

<h3>Arguments:</h3>

- image_file (File) — image file (Blob), e.g., from input.files or created dynamically.
- options (Object) — same options as the attribute form (keys as object properties).
Options (object form):
- - type (String) — output image type: jpeg, png, webp, gif. If omitted, the original type is preserved.
- - max_height (Float) — maximum height in pixels (resize only if original height exceeds this).
- - max_width (Float) — maximum width in pixels (resize only if original width exceeds this).
- - quality (Float) — quality level 0–1 (applies to jpeg and webp only). Default: 1.
- - name (String) — output file name; the extension can be used to infer the output type. If omitted, the original name is preserved.
- - height (Float) — exact output height in pixels.
- - width (Float) — exact output width in pixels.
- - get_extra_data (Boolean) — if true, the function returns additional metadata instead of only a Blob/File (default: false).
	The extra-data structure:
```javascript
{
	input: {
		file: file, // (File instance) — original image file
		name: fileName, // (String) — original image name
		type: fileType, // (String) — original image MIME type
		size: fileSize, // (Number) — original image size in bytes
		height: imageHeight, // (Number) — original image height in pixels
		width: imageWidth // (Number) — original image width in pixels
	},
	output: {
		file: file, // (File instance) — resized image file
		name: fileName, // (String) — resized image name
		type: fileType, // (String) — resized image MIME type
		size: fileSize, // (Number) — resized image size in bytes
		height: imageHeight, // (Number) — resized image height in pixels
		width: imageWidth // (Number) — resized image width in pixels
	}
}
```
<h3>Returns:</h3>

Promise that resolves to a File (blob of the resized image) when get_extra_data is false, otherwise resolves to the extra-data object.
Example:
```html
<input type=file id=img_file>

<script>
	
	const input_file = document.getElementById('img_file');
	input_file.addEventListener('change', () => {
		if(!input_file.value) return;
		resize_image_file(input_file.files[0], {heigth: 200, get_extra_data: true}).then(res => {
			console.log(res);
			const img = new Image();
			img.src = URL.createObjectURL(res.output.file);
			document.body.append(img);
		});
	});
	
</script>
```

<h2> How it works </h2>

- When the user selects an image, the script reads the file’s blob data from the input.
- An Image element is created from that blob and drawn to a canvas sized per the desired output.
- The canvas content is exported to the requested format/quality as a Blob/File.
- The resulting File replaces the original in input.files (or is returned via the API). That's it.
