/*
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be
 * useful but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301, USA.
 *
 */
function cpInit(){
	var sphere = new UvumiSphere('.pick',{
		onChange:function(input,hex){
//			alert("cpInit: "+ input);
			var id = input.id;
			id = id.substr(id.indexOf('_')+1);
			$(input).setStyle('background-color',hex);
			var node = ontTree.root.getNodeById(id);
			node.color = hex.hexToRgb(true);		
		}
	});
}
