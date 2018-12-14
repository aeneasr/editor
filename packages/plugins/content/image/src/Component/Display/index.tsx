/*
 * This file is part of ORY Editor.
 *
 * ORY Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ORY Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with ORY Editor.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license LGPL-3.0
 * @copyright 2016-2018 Aeneas Rekkas
 * @author Aeneas Rekkas <aeneas+oss@aeneas.io>
 *
 */

import * as React from 'react';
import ImageIcon from '@material-ui/icons/Panorama';

import { iconStyle } from '../common';
import { PropTypes } from '../index.js';
import { ImageLoaded } from 'ory-editor-ui/lib/ImageUpload';

export type DisplayProps = PropTypes & {
  imagePreview?: ImageLoaded;
};

const Display: React.SFC<DisplayProps> = ({
  isEditMode,
  state,
  imagePreview,
}) => {
  const src = imagePreview ? imagePreview.dataUrl : state.src;
  const Image = <img className="ory-plugins-content-image" alt="" src={src} />;
  return src ? (
    <div>
      {state.href && !isEditMode ? (
        <a href={state.href} target={state.target} rel={state.rel}>
          {Image}
        </a>
      ) : (
        Image
      )}
    </div>
  ) : (
    <div>
      <div className="ory-plugins-content-image-placeholder">
        <ImageIcon style={iconStyle} />
      </div>
    </div>
  );
};

export default Display;
