import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
  X,
  CheckCircle,
  AlertTriangle,
  Upload,
  Info,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { ComplaintCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';

interface Props {
  category: ComplaintCategory;
  subcategory?: string;
  onBack: () => void;
  onSubmitSuccess: (complaintId: string) => void;
}

interface PhotoItem {
  id: string;
  url: string;
  name: string;
  size: number;
}

export const Screen7_ReportUploadDetails: React.FC<Props> = ({
  category,
  subcategory,
  onBack,
  onSubmitSuccess
}) => {
  const { user } = useAuth();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Photos state (multiple photos up to 4)
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [showLiveCameraModal, setShowLiveCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Form states
  const [locationText, setLocationText] = useState('MG Road, Near Bus Stand, Rampur');
  const [ward, setWard] = useState(user?.ward || 'Ward 4');
  const [latitude, setLatitude] = useState(26.8467);
  const [longitude, setLongitude] = useState(80.9462);
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [description, setDescription] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');

  // Confirmation & submission state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const catInfo = CATEGORIES[category];

  // Process selected file(s)
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg('');

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (photos.length + files.length > 4) {
      setErrorMsg('You can upload a maximum of 4 evidence photos.');
      return;
    }

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setErrorMsg(`"${file.name}" is not a supported format. Please upload JPEG, PNG, or WEBP.`);
        return;
      }

      if (file.size > maxSizeBytes) {
        setErrorMsg(`"${file.name}" exceeds 5MB size limit. Please choose a smaller photo.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPhotos((prev) => [
            ...prev,
            {
              id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              url: reader.result as string,
              name: file.name,
              size: file.size
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (e.target) e.target.value = '';
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (e.target) e.target.value = '';
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Live Camera Stream modal for desktop/webcam or direct mobile capture
  const startLiveCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setCameraStream(stream);
        setShowLiveCameraModal(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        }, 200);
      } else {
        cameraInputRef.current?.click();
      }
    } catch {
      // Fallback to native file input with capture="environment"
      cameraInputRef.current?.click();
    }
  };

  const captureLivePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotos((prev) => [
        ...prev,
        {
          id: `cam_${Date.now()}`,
          url: dataUrl,
          name: `camera_capture_${photos.length + 1}.jpg`,
          size: Math.round((dataUrl.length * 3) / 4)
        }
      ]);
    }
    closeLiveCamera();
  };

  const closeLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowLiveCameraModal(false);
  };

  // Sample photo fallback
  const handleUseSamplePhoto = () => {
    let sample = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80';
    if (category === 'road') {
      sample = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
    } else if (category === 'streetlight') {
      sample = 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80';
    } else if (category === 'water') {
      sample = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
    } else if (category === 'drainage') {
      sample = 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80';
    } else if (category === 'electricity') {
      sample = 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80';
    }

    setPhotos([
      {
        id: `sample_${Date.now()}`,
        url: sample,
        name: `${category}_evidence.jpg`,
        size: 1024 * 250
      }
    ]);
  };

  // Fetch real device GPS
  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter location manually.');
      return;
    }
    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Number(pos.coords.latitude.toFixed(5)));
        setLongitude(Number(pos.coords.longitude.toFixed(5)));
        setLocationText(`GPS Location: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        setIsFetchingGps(false);
      },
      (err) => {
        console.warn('GPS access:', err.message);
        setIsFetchingGps(false);
        alert('Could not obtain GPS permission. You can type the exact village address manually.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleValidateAndReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (category === 'other' && !customTitle.trim()) {
      setErrorMsg('Please enter a custom problem title for Other Services.');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg('Please enter at least 10 characters describing the problem.');
      return;
    }

    if (!locationText.trim()) {
      setErrorMsg('Please provide the location or locality in the village.');
      return;
    }

    setShowReviewModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalImageUrls =
        photos.length > 0
          ? photos.map((p) => p.url)
          : ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'];

      const newComplaint = storage.addComplaint({
        citizenId: user?.id || 'usr_guest',
        citizenName: user?.name || 'Ravi Kumar',
        citizenPhone: user?.phone || '+91 98765 43210',
        category,
        customCategoryTitle: category === 'other' ? customTitle.trim() : undefined,
        subcategory: subcategory || undefined,
        description: description.trim(),
        imageUrls: finalImageUrls,
        address: locationText.trim(),
        ward: ward.trim() || 'Ward 4',
        latitude,
        longitude,
        priority: category === 'electricity' ? 'urgent' : 'medium',
        assignedDepartment:
          category === 'other' && customDepartment.trim()
            ? customDepartment.trim()
            : catInfo.department
      });

      setShowReviewModal(false);
      onSubmitSuccess(newComplaint.id);
    } catch {
      setErrorMsg('Failed to submit complaint. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between bg-white px-5 py-4 overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-slate-800">Report an Issue</h2>
          <div className="w-5" />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-3 mb-2">
          <div className="flex-1 h-1.5 rounded-full bg-blue-600" />
          <div className="flex-1 h-1.5 rounded-full bg-blue-600" />
        </div>
        <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
          Step 2 of 2: Upload &amp; Details
        </p>

        {/* Category Header Badge */}
        <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Category
            </span>
            <h4 className="text-xs font-bold text-slate-800">
              {catInfo.name} {subcategory ? `• ${subcategory}` : ''}
            </h4>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Change
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleValidateAndReview} className="mt-4 space-y-4">
          {/* Custom title if Other Services */}
          {category === 'other' && (
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-1">
                  Custom Problem Title *
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Village Community Hall Roof Repair"
                  className="w-full px-3 py-2 bg-white border border-purple-200 focus:border-purple-500 rounded-xl text-xs font-medium text-slate-800 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-1">
                  Relevant Department (Optional)
                </label>
                <input
                  type="text"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  placeholder="e.g. Panchayat Civil Works / Education Dept"
                  className="w-full px-3 py-2 bg-white border border-purple-200 focus:border-purple-500 rounded-xl text-xs font-medium text-slate-800 outline-none"
                />
              </div>
            </div>
          )}

          {/* 1. Upload Photo - Camera & Gallery */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Evidence Photos ({photos.length}/4)
              </label>
              {photos.length === 0 && (
                <button
                  type="button"
                  onClick={handleUseSamplePhoto}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Use Sample Photo
                </button>
              )}
            </div>

            {/* Hidden Inputs for Camera and Gallery */}
            <input
              type="file"
              ref={galleryInputRef}
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleGalleryChange}
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              onChange={handleCameraChange}
              className="hidden"
            />

            {/* Upload Action Buttons */}
            {photos.length < 4 && (
              <div className="grid grid-cols-2 gap-2 mb-2.5">
                <button
                  type="button"
                  onClick={startLiveCamera}
                  className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <span>From Gallery</span>
                </button>
              </div>
            )}

            {/* Photo Previews Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {photos.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs"
                  >
                    <img
                      src={item.url}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white">
                      Photo {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePhoto(item.id)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-transform active:scale-90"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length === 0 && (
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="w-full h-28 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5 stroke-[1.75]" />
                </div>
                <p className="text-xs font-bold text-slate-700">Tap to capture or choose from gallery</p>
                <p className="text-[10px] text-slate-400">JPEG, PNG, WEBP (Max 5MB each)</p>
              </div>
            )}
          </div>

          {/* 2. Location */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">Location</label>
              <button
                type="button"
                onClick={handleFetchGps}
                disabled={isFetchingGps}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
              >
                <RefreshCw className={`w-3 h-3 ${isFetchingGps ? 'animate-spin' : ''}`} />
                <span>{isFetchingGps ? 'Fetching GPS...' : 'Use Current GPS'}</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Enter village address, street or landmark"
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none transition-all"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Location set" />
              </div>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>Ward: {ward}</span>
              <span className="font-mono text-[10px] text-slate-400">
                {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
              </span>
            </div>
          </div>

          {/* 3. Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">Description</label>
              <span className="text-[11px] font-mono text-slate-400">{description.length}/200</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="Write a short description of the problem..."
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none resize-none transition-all"
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 pb-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Complaint</span>
            </button>
          </div>
        </form>
      </div>

      {/* Live Camera Modal */}
      {showLiveCameraModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-between p-4">
          <div className="w-full flex justify-between items-center text-white pt-2">
            <span className="font-bold text-sm">Live Camera Capture</span>
            <button onClick={closeLiveCamera} className="p-1 rounded-full bg-white/20 text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full max-w-sm aspect-3/4 rounded-2xl overflow-hidden bg-black relative flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>

          <div className="w-full flex justify-center pb-6">
            <button
              type="button"
              onClick={captureLivePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-blue-600 flex items-center justify-center shadow-xl active:scale-95 transition-transform"
            >
              <Camera className="w-7 h-7 text-blue-600" />
            </button>
          </div>
        </div>
      )}

      {/* Review Modal Dialog before final submit */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Info className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 text-center">
              Review Complaint
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              Please confirm your report details before submitting to Gram Panchayat.
            </p>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-slate-800">{catInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Photos Attached:</span>
                <span className="font-bold text-blue-600">{photos.length || 1} photo(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[180px] text-right">
                  {locationText}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitting As:</span>
                <span className="font-semibold text-slate-800">{user?.name || 'Ravi Kumar'}</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 text-slate-600 italic line-clamp-2">
                "{description}"
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="py-2.5 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
