const upload = document.querySelector('.upload');
const imageInput = document.createElement('input');

imageInput.type = 'file';
imageInput.accept = '.jpeg,.png,.gif';

document.querySelectorAll('.input_holder').forEach((element) => {
  const input = element.querySelector('.input');
  if (input) {
    input.addEventListener('click', () => {
      element.classList.remove('error_shown');
    });
  }
});

if (upload) {
  upload.addEventListener('click', () => imageInput.click());

  imageInput.addEventListener('change', async () => {
    resetUploadState();

    const file = imageInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: 'Client-ID 774f3ba80197c47',
        },
        body: formData,
      });

      const result = await response.json();

      if (result?.data?.link) {
        updateUploadState(result.data.link);
      } else {
        showErrorState();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      showErrorState();
    }
  });
}

const goButton = document.querySelector('.go');
if (goButton) {
  goButton.addEventListener('click', () => {
    const emptyFields = [];
    const params = new URLSearchParams();

    if (!upload?.hasAttribute('selected')) {
      emptyFields.push(upload);
      upload?.classList.add('error_shown');
    } else {
      params.append('image', upload.getAttribute('selected'));
    }

    document.querySelectorAll('.input_holder').forEach((element) => {
      const input = element.querySelector('.input');
      if (input) {
        params.append(input.id, input.value);

        if (isEmpty(input.value)) {
          emptyFields.push(element);
          element.classList.add('error_shown');
        }
      }
    });

    if (emptyFields.length > 0) {
      emptyFields[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      forwardToId(params);
    }
  });
}

function isEmpty(value) {
  return /^\s*$/.test(value);
}

function resetUploadState() {
  if (upload) {
    upload.classList.remove('upload_loaded', 'upload_loading', 'error_shown');
    upload.removeAttribute('selected');
  }
}

function updateUploadState(url) {
  if (upload) {
    upload.classList.add('upload_loaded');
    upload.setAttribute('selected', url);

    const uploadedImage = upload.querySelector('.upload_uploaded');
    if (uploadedImage) {
      uploadedImage.src = url;
    }
  }
}

function showErrorState() {
  upload?.classList.add('error_shown');
}

function forwardToId(params) {
  location.href = `/yObywatel/id?${params}`;
}

const guide = document.querySelector('.guide_holder');
if (guide) {
  guide.addEventListener('click', () => {
    guide.classList.toggle('unfolded');
  });
}
