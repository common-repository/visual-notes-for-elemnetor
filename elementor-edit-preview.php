<?php
/**
 * @package visual-notes-for-elementor
 * @version 1.0
 */
/*
Plugin Name: Visual Notes For Elemnetor
Plugin URI: https://wordpress.org/plugins/elementorformpplus/
Description: elementor_edit_preview
Author: Tziki Trop
Version: 1.0
Author URI: http://pooslestudio.co.il/
Text Domain: visual-notes-for-elementor
*/

namespace elementor_edit_preview;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
class EEP_elementor_edit_preview {
    protected $elementor_editor;
    	public function __construct() {
            global $elementor_editor;
            global $wp_query;
        	$this->add_actions();
            $this->elementor_editor = false;
         }
    
    	private function add_actions() {
            add_filter('elementor/widget/print_template', [ $this,'print_template']);
                         add_action( 'wp_ajax_get_preview_elemnts',  [ $this,'get_preview_elemnts'] );
add_action( 'wp_ajax_nopriv_get_preview_elemnts',  [ $this,'get_preview_elemnts' ]);
          //  add_filter('query_vars', array($this, 'add_query_vars'), 0);
            add_action( 'wp_ajax_save_preview',  [ $this,'save_preview'] );
add_action( 'wp_ajax_nopriv_save_preview',  [ $this,'save_preview' ]);
                add_action( 'admin_init', [ $this,'register_plugin_settings'] );
     add_action('plugins_loaded', [ $this,'elementor_edit_preview_load_textdomain']);
// add_action( 'elementor/frontend/after_register_scripts', [ $this, 'widget_scripts' ] );
add_action( 'elementor/frontend/after_register_scripts',[$this,'add_js_editor_toeditor']);
add_action('wp_enqueue_scripts', [ $this,'add_css_and_js']);
            add_action( 'wp',  [ $this,'login_redirect'] );
            add_action( 'admin_bar_menu', [ $this,'note_to_admin_bar'], 999 );
 add_action( 'elementor/preview/enqueue_styles',[$this,'add_css_editor_toeditor']);
	}
    function print_template($content_template,$element ){
        $content_template .= "<i class=\"note_icon fa fa-pencil\"></i>";
        return $content_template;
    }
function add_elementor_page_settings_controls( \Elementor\PageSettings\Page $page ) {
	$page->add_control(
		'menu_item_color',
		[
			'label' => __( 'Menu Item Color', 'elementor' ),
			'type' => \Elementor\Controls_Manager::COLOR,
			'selectors' => [
				'{{WRAPPER}} .menu-item a' => 'color: {{VALUE}}',
			],
		]
	);
}
public function register_plugin_settings() {

      register_setting('elementor_edit_preview', 'elements_array' );
}
   	public function add_query_vars($vars){
		$vars[] = 'notes';
    
		return $vars;
	}
public function add_js_editor_toeditor(){
   wp_enqueue_script('elementoreditorpreviewjs', plugin_dir_url(__FILE__) . 'js/editorscript.js', array( 'jquery' ), '1.0.0', true); 
    wp_localize_script( 'visual-notes-for-elementorjs', 'php_vars', $this->php_vars() );
    /// wp_enqueue_style( 'visual-notes-for-elementorcss', plugin_dir_url(__FILE__) . 'css/main.css',false,'1.1','all');
}
     // add_action( 'elementor/preview/enqueue_styles',[$this,'add_css_editor_toedito']);
  public function add_css_editor_toeditor() {
  wp_enqueue_style( 'visual-notes-for-elementorcss', plugin_dir_url(__FILE__) . 'css/main.css',false,'1.1','all');
}
   public function add_js_editor(){

 wp_enqueue_style( 'visual-notes-for-elementorcss', plugin_dir_url(__FILE__) . 'css/main.css',false,'1.1','all');
wp_enqueue_script('visual-notes-for-elementorjs-toeditor', plugin_dir_url(__FILE__) . 'js/maineditor.js', array( 'jquery' ), '1.0.0', true);
   $status_types = "{'completed':".__( 'completed', 'visual-notes-for-elementor' ).",";
       $status_types .= "{'activ':".__( 'activ', 'visual-notes-for-elementor' ).",";
        $status_types .= "{'empty':".__( 'empty', 'visual-notes-for-elementor' )."}";
$dataToBePassed = array(
    'status_types' =>  $status_types,
    'post_id' =>  get_queried_object_id(),
    'elements'       =>  get_option( 'elements_array' , false  ),
    'user_id'            => get_current_user_id(),
    'text_save'            => __( 'Save', 'visual-notes-for-elementor' ),
    'text_close'            => __( 'Close', 'visual-notes-for-elementor' ),
     'text_add_note'            => __( 'Add note', 'visual-notes-for-elementor' ),
      'text_reply_note'            => __( 'Reply', 'visual-notes-for-elementor' ),
     'text_completed'            => __( 'Completed', 'visual-notes-for-elementor' ),
     'text_delete'            => __( 'Delete', 'visual-notes-for-elementor' ),
);
wp_localize_script( 'visual-notes-for-elementorjs-toeditor', 'php_vars', $dataToBePassed );

}
    function login_redirect() {

    // Current Page
    global $pagenow;
    global $wp_query;
    // Check to see if user in not logged in and not on the login page
    if(isset($_GET['notes']) && !is_user_logged_in() && $pagenow != 'wp-login.php')
          // If user is, Redirect to Login form.
          auth_redirect();
}
// add the block of code above to the WordPress template


function note_to_admin_bar( $wp_admin_bar ) {
	if(is_user_logged_in() && is_page()){
    global $wp;
    global $wp_query; 
      $url = home_url( $wp->request );
    $url =  add_query_arg( array( 'notes' => 'active'),  $url);
		$not_text = __('Activate Notes mode','visual-notes-for-elementor');
     $class = "notes_admin_bar";
    if(isset($_GET['notes'])){
       $class .= " activ";
$url = home_url( $wp->request );
		$not_text = __('Turn off Notes mode','visual-notes-for-elementor');
        }
    
    
	$args = array(
		'id'    => 'note_icon',
		'title' => '<span class="ab-icon"></span>'.$not_text,
		'href'  => $url,
		'meta'  => array( 'class' => $class )
	);//dashicons-edit
	$wp_admin_bar->add_node( $args );
    }
}
    public function add_css_and_js(){
        	
          // return;
 global $wp_query;
    
//if(isset($wp_query->query_vars['notes']) && is_user_logged_in()){
if(isset($_GET['notes']) && is_user_logged_in()){
 wp_enqueue_style( 'visual-notes-for-elementorcss', plugin_dir_url(__FILE__) . 'css/main.css',false,'1.1','all');
     wp_enqueue_style( 'elementor-edit-edit-css', plugin_dir_url(__FILE__) . 'css/edit.css',false,'1.1','all');
wp_enqueue_script('visual-notes-for-elementorjs', plugin_dir_url(__FILE__) . 'js/main.js', array( 'jquery' ), '1.0.0', true);
   
 

wp_localize_script( 'visual-notes-for-elementorjs', 'php_vars', $this->php_vars() );
            }
else {
    wp_enqueue_style( 'visual-notes-for-elementorcss', plugin_dir_url(__FILE__) . 'css/main.css',false,'1.1','all');
wp_enqueue_script('visual-notes-for-elementorjs', plugin_dir_url(__FILE__) . 'js/editscript.js', array( 'jquery' ), '1.0.0', true);
}
    }
    private function php_vars(){
		if(!is_user_logged_in())
			return false;
      $user_info = get_userdata(get_current_user_id());
      $nicename = $user_info->user_nicename;
        $status_types = array(
(object) ['name' => 'completed','display_name' =>  __( 'completed', 'visual-notes-for-elementor' )],
(object) ['name' => 'activ','display_name' =>  __( 'activ', 'visual-notes-for-elementor' )],
(object) ['name' => 'empty','display_name' =>  __( 'empty', 'visual-notes-for-elementor' )],
   
);

             $device = (object) [
'desktop_name' => __( 'desktop', 'visual-notes-for-elementor' ),'desktop_width' => 50000,
 'mobile_name' => __( 'mobile', 'visual-notes-for-elementor' ),'mobile_width' => 767,
  'tablet_name' => __( 'tablet', 'visual-notes-for-elementor' ),'tablet_width' => 1024,

];
              $dataToBePassed = array(
                  'device' => $device,
                  'status_types' =>  $status_types,
           'post_id' =>  get_queried_object_id(),
            'url_to_edit' => home_url(),
          'url' => plugin_dir_url(__FILE__) . 'js/maineditor.js',
         'cssurl' => plugin_dir_url(__FILE__) . 'css/main.css',
    'elements'       =>  get_option( 'elements_array' , false  ),
    'user_id'            => get_current_user_id(),
    'text_save'            => __( 'Save', 'visual-notes-for-elementor' ),
    'text_close'            => __( 'Close', 'visual-notes-for-elementor' ),
     'text_add_note'            => __( 'Add note', 'visual-notes-for-elementor' ),
      'text_reply_note'            => __( 'Reply', 'visual-notes-for-elementor' ),
     'text_completed'            => __( 'Completed', 'visual-notes-for-elementor' ),
     'text_delete'            => __( 'Delete', 'visual-notes-for-elementor' ),
        'text_open' => __( 'Open', 'visual-notes-for-elementor' ),
                  'text_note_from' => __( 'Note from: ', 'visual-notes-for-elementor' ),
                  'text_reply_from' => __( 'Note from: ', 'visual-notes-for-elementor' ),
                   'text_open_page' => __( 'Open page', 'visual-notes-for-elementor' ),
                  'text_collaps' => __( 'collaps', 'visual-notes-for-elementor' ),
                  'user_diaply_name' => $nicename,
                  'note_status' =>  __( 'Note status: ', 'visual-notes-for-elementor' ),
);
        return $dataToBePassed;
    }
   public function get_preview_elemnts(){
 
       echo json_encode($this->php_vars());
         wp_die();   
   }
    public function save_preview(){
        $array = $_POST['elements'];
          update_option( 'elements_array' ,$array );
        $arrresolt = [];
             array_push($arrresolt,  "true");
         echo json_encode($arrresolt);
        wp_die();
    }
public function elementor_edit_preview_load_textdomain() {
    
	load_plugin_textdomain( 'visual-notes-for-elementor', false, dirname( plugin_basename(__FILE__) ) . '/lang/' );
}
    public function on_widgets_registered() {
		$this->includes();
	}
    	private function includes() {
 
	}

	}
 new EEP_elementor_edit_preview();  
