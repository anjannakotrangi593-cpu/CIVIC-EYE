import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Camera,
  MapPin,
  RefreshCw,
  X,
  CheckCircle,
  AlertTriangle,
  Upload,
  Info
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

export const Screen7_ReportUploadDetails: React.FC<Props> = ({
  category,
  subcategory,
  onBack,
  onSubmitSuccess
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');
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

  // Handle Photo File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 8MB. Please choose a smaller photo.');
      return;
    }

    setErrorMsg('');
    setPhotoName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Preset realistic sample photo for quick testing if camera not available
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
    setPhotoUrl(sample);
    setPhotoName('civic_evidence.jpg');
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
      const finalImageUrls = photoUrl
        ? [photoUrl]
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
    } catch (err) {
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

          {/* 1. Upload Photo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">Upload Photo</label>
              {!photoUrl && (
                <button
                  type="button"
                  onClick={handleUseSamplePhoto}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Use Sample Photo
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {!photoUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6 stroke-[1.75]" />
                </div>
                <p className="text-xs font-bold text-slate-700">Tap to capture or upload photo</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG up to 8MB</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs">
                <img
                  src={photoUrl}
                  alt="Complaint Preview"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-medium truncate max-w-[70%]">
                    {photoName || 'Captured photo'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl('');
                      setPhotoName('');
                    }}
                    className="p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                    title="Remove photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
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
              <span>Submit</span>
            </button>
          </div>
        </form>
      </div>

      {/* Review Modal Dialog before final submit (prevents duplicate submission) */}
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
